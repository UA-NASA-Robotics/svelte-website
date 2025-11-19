import type { Cookies } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Database } from '../../../../components/Database';
import { getCurrentSchoolYear, sortMembers } from './attendanceHelpers';
import { getAttendanceCounts, getAvailableYears, getCountForMemberByYear } from './attendanceData';
import { getDuesStatus } from './duesData';
import { getOutreachCounts } from './outreachData';
import { getMembers } from './memberData';

export async function load({ cookies, url }: { cookies: Cookies; url: URL }) {
	const attendance_auth = cookies.get('attendance_auth');
	if (attendance_auth !== 'true') {
		throw redirect(303, '/attendance/login');
	}

	const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');

	// Get available years
	let years = await getAvailableYears(db);

	// Get selected year from URL or default to current school year
	const currentSchoolYear = getCurrentSchoolYear();
	const urlYear = url.searchParams.get('year')?.trim() || '';
	const selectedYear = urlYear || String(currentSchoolYear);

	// Ensure selectedYear is in the years list
	if (!years.includes(selectedYear)) {
		years = [selectedYear, ...years].sort().reverse();
	}

	const selectedYearNum = Number(selectedYear);

	// Load all data in parallel
	const [attendanceResult, duesMap, outreachData] = await Promise.all([
		getAttendanceCounts(db, selectedYear),
		getDuesStatus(db, selectedYear),
		getOutreachCounts(db, selectedYearNum)
	]);

	const { countsMap, usedDedupByYear } = attendanceResult;

	// Get members with enriched data
	let { active, inactive } = await getMembers(db, countsMap, duesMap, outreachData);

	// If filtering by year and we didn't have per-year counts, recompute counts
	if (selectedYear && !usedDedupByYear) {
		await Promise.all([
			...active.map(async (m) => {
				m.count = await getCountForMemberByYear(db, m.zip, selectedYear);
			}),
			...inactive.map(async (m) => {
				m.count = await getCountForMemberByYear(db, m.zip, selectedYear);
			})
		]);
	}

	// Sort members
	active.sort(sortMembers);
	inactive.sort(sortMembers);

	return { props: { active, inactive, years, selectedYear } };
}
