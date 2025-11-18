import { redirect, fail } from '@sveltejs/kit';
import { Database } from '../../../../components/Database';

// Calculate school year: June (6) onwards rounds up to next calendar year
function calculateSchoolYear(date: Date): number {
	const year = date.getFullYear();
	const month = date.getMonth() + 1; // 0-indexed, so +1 for 1-12
	return month >= 6 ? year + 1 : year;
}

// Parse date strings to compare with outreach dates
function parseDateString(dateStr: string): { month: number; day: number; year: number } | null {
	try {
		// Try parsing as "M/D/YYYY, H:MM:SS AM/PM" format
		const parts = dateStr.split(',')[0].split('/');
		if (parts.length === 3) {
			return {
				month: parseInt(parts[0], 10),
				day: parseInt(parts[1], 10),
				year: parseInt(parts[2], 10)
			};
		}
	} catch {
		return null;
	}
	return null;
}

// Normalize date string to YYYY-MM-DD format for deduplication
function normalizeDateToDay(dateStr: string): string | null {
	const parsed = parseDateString(dateStr);
	if (!parsed) return null;
	const { year, month, day } = parsed;
	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Check if a date matches an outreach day and return the matching outreach date key
function getMatchingOutreachDay(dateStr: string, outreachDays: Array<{ datearray: number[]; key: string }>): string | null {
	const parsed = parseDateString(dateStr);
	if (!parsed) return null;

	for (const outreach of outreachDays) {
		if (!outreach.datearray || outreach.datearray.length < 3) continue;
		const [oYear, oMonth, oDay] = outreach.datearray;
		if (parsed.year === oYear && parsed.month === oMonth && parsed.day === oDay) {
			return outreach.key;
		}
	}
	return null;
}

// Calculate outreach attendance for a given year
async function calculateOutreachAttendance(db: Database, year: number): Promise<Record<string, number>> {
	// Get all outreach days for the year
	const outreachResult = await db.read(
		'attendance',
		`_design/outreach/_view/outreachDays?startkey=${year}&endkey=${year}`
	);
	const outreachDays = (outreachResult?.rows ?? []).map((r: any) => ({
		datearray: r.value,
		key: `${r.value[0]}-${r.value[1]}-${r.value[2]}` // YYYY-MM-DD key for matching
	}));

	if (outreachDays.length === 0) {
		return {}; // No outreach days for this year
	}

	// Get all member IDs
	const membersResult = await db.read('members', '_all_docs');
	const memberIds = (membersResult?.rows ?? []).map((r: any) => r.id).filter((id: string) => id && !id.startsWith('_design'));

	// Calculate outreach count for each member
	const outreachCounts: Record<string, number> = {};

	await Promise.all(
		memberIds.map(async (zipId: string) => {
			const attendanceResult = await db.read(
				'attendance',
				`_design/stats/_view/dates_by_zip?startkey="${zipId}"&endkey="${zipId}"`
			);
			const attendanceDates = (attendanceResult?.rows ?? []).map((r: any) => r.value);

			// Track unique outreach days attended (deduplicate by outreach day)
			const uniqueOutreachDays = new Set<string>();
			
			for (const dateStr of attendanceDates) {
				const matchingOutreachDay = getMatchingOutreachDay(dateStr, outreachDays);
				if (matchingOutreachDay) {
					uniqueOutreachDays.add(matchingOutreachDay);
				}
			}

			outreachCounts[zipId] = uniqueOutreachDays.size;
		})
	);

	return outreachCounts;
}

// Cache outreach attendance data
async function cacheOutreachData(db: Database, year: number, data: Record<string, number>): Promise<boolean> {
	const cacheDoc = {
		year,
		data,
		lastUpdated: new Date().toISOString()
	};

	const result = await db.update('keys', 'outreachCache', cacheDoc);
	return result && 'ok' in result && result.ok;
}

export async function load({ cookies }) {
	const attendance_auth = cookies.get('attendance_auth');
	if (attendance_auth !== 'true') {
		throw redirect(303, '/attendance/login');
	}

	// Load existing outreach markers using the efficient view
	const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
	const viewResult = await db.read('attendance', '_design/outreach/_view/outreachDays');

	const outreachDays = (viewResult?.rows ?? [])
		.map((r: any) => ({
			id: r.id,
			year: r.key,
			datearray: r.value,
			dateString: r.value ? `${r.value[1]}/${r.value[2]}/${r.value[0]}` : 'Unknown'
		}))
		.sort((a: any, b: any) => {
			// Sort by year desc, then by datearray desc
			if (a.year !== b.year) return b.year - a.year;
			if (!a.datearray || !b.datearray) return 0;
			for (let i = 0; i < 3; i++) {
				if (a.datearray[i] !== b.datearray[i]) return b.datearray[i] - a.datearray[i];
			}
			return 0;
		});

	return { props: { outreachDays } };
}

export const actions = {
	create: async ({ request, cookies }) => {
		const attendance_auth = cookies.get('attendance_auth');
		if (attendance_auth !== 'true') {
			return fail(401, { success: false, message: 'You are not authenticated.' });
		}

		const form = await request.formData();
		const dateStr = (form.get('date') ?? '').toString().trim();

		if (!dateStr) {
			return fail(400, { success: false, message: 'Please select a date.' });
		}

		let date: Date;
		try {
			date = new Date(dateStr);
			if (isNaN(date.getTime())) {
				throw new Error('Invalid date');
			}
		} catch {
			return fail(400, { success: false, message: 'Invalid date format.' });
		}

		const year = calculateSchoolYear(date);
		const schoolYearForDateArray = date.getMonth() + 1 >= 6 ? date.getFullYear() + 1 : date.getFullYear();
		const datearray = [
			date.getFullYear(),
			date.getMonth() + 1, // 1-12
			date.getDate() +1 // 1-31
		];

		const doc = {
			type: 'outreachMarker',
			year,
			datearray
		};

		const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
		const result = await db.append('attendance', doc);

		if (result && 'ok' in result && result.ok) {
			// Trigger recalculation for this year
			await calculateOutreachAttendance(db, year).then(data => cacheOutreachData(db, year, data));
			return { success: true, message: `Outreach day added for ${dateStr} (School Year ${year}).` };
		}

		return fail(500, { success: false, message: 'Failed to save outreach marker to database.' });
	},

	delete: async ({ request, cookies }) => {
		const attendance_auth = cookies.get('attendance_auth');
		if (attendance_auth !== 'true') {
			return fail(401, { success: false, message: 'You are not authenticated.' });
		}

		const form = await request.formData();
		const docId = (form.get('id') ?? '').toString().trim();

		if (!docId) {
			return fail(400, { success: false, message: 'No document ID provided.' });
		}

		const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
		
		// Get the year before deleting so we can recalculate
		const doc = await db.read('attendance', docId);
		const yearToRecalc = doc?.year;
		
		const result = await db.delete('attendance', docId);

		if (result && 'ok' in result && result.ok) {
			// Trigger recalculation for the affected year
			if (yearToRecalc) {
				await calculateOutreachAttendance(db, yearToRecalc).then(data => cacheOutreachData(db, yearToRecalc, data));
			}
			return { success: true, message: 'Outreach day deleted.' };
		}

		return fail(500, { success: false, message: 'Failed to delete outreach marker.' });
	},

	recalculate: async ({ request, cookies }) => {
		const attendance_auth = cookies.get('attendance_auth');
		if (attendance_auth !== 'true') {
			return fail(401, { success: false, message: 'You are not authenticated.' });
		}

		const form = await request.formData();
		const yearStr = (form.get('year') ?? '').toString().trim();

		if (!yearStr) {
			return fail(400, { success: false, message: 'Please provide a year.' });
		}

		const year = parseInt(yearStr, 10);
		if (isNaN(year)) {
			return fail(400, { success: false, message: 'Invalid year format.' });
		}

		const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
		
		try {
			const data = await calculateOutreachAttendance(db, year);
			const cached = await cacheOutreachData(db, year, data);
			
			if (cached) {
				const memberCount = Object.keys(data).length;
				const totalOutreach = Object.values(data).reduce((sum, count) => sum + count, 0);
				return { 
					success: true, 
					message: `Recalculated outreach attendance for ${year}. ${memberCount} members, ${totalOutreach} total outreach attendances.` 
				};
			}
			
			return fail(500, { success: false, message: 'Failed to cache outreach data.' });
		} catch (error) {
			return fail(500, { success: false, message: `Calculation failed: ${error}` });
		}
	}
};
