// @ts-nocheck
import { redirect, fail } from '@sveltejs/kit';
import { Database } from '../../../../components/Database';

// Helper: compute school year similar to attendance
function schoolYearFromDate(d) {
	const yr = d.getFullYear();
	const m = d.getMonth() + 1; // 1-12
	return m >= 6 ? yr + 1 : yr;
}

export async function load({ cookies, url }) {
	const attendance_auth = cookies.get('attendance_auth');
	if (attendance_auth !== 'true') {
		throw redirect(303, '/attendance/login');
	}

	const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');

	// Members list
	const allDocs = await db.read('members', '_all_docs?include_docs=true');
	const members = (allDocs?.rows ?? [])
		.map((r) => ({ id: r.id, ...(r.doc || {}) }))
		.filter((m) => m.isMember === true)
		.map((m) => ({ zip: m._id || m.id, name: m.name || m._id || m.id, subTeam: m.subTeam || '' }))
		.sort((a, b) => a.name.localeCompare(b.name));

	// Build list of available years from dues_by_zip_year, and ensure current year exists
	const yearsRows = await db.read('dues', `_design/stats/_view/dues_by_zip_year?group=true`);
	const yearsSet = new Set();
	for (const r of yearsRows?.rows ?? []) {
		// keys expected as [zip, year]
		const key = r.key;
		if (Array.isArray(key) && key.length >= 2) yearsSet.add(String(key[1]));
	}
	const currentSY = String(schoolYearFromDate(new Date()));
	yearsSet.add(currentSY);
	const years = Array.from(yearsSet).sort().reverse();

	// Selected year filter — defaults to current school year
	let selectedYear = (url.searchParams.get('year') || '').trim();
	if (!selectedYear) selectedYear = currentSY;
	if (!years.includes(selectedYear)) years.unshift(selectedYear);

	// Use CouchDB view stats/zip_by_year to fetch [zip, method] for the selected year and hydrate with doc id & dates
	const yearNum = Number(selectedYear);
	const ykey = encodeURIComponent(JSON.stringify([yearNum]));
	const duesRows = await db.read('dues', `_design/stats/_view/zip_by_year?startkey=${ykey}&endkey=${ykey}`);
	const paidMap = new Map();
	for (const r of duesRows?.rows ?? []) {
		const val = r.value || [];
		const zip = val[0];
		const method = val[1] || 'other';
		const id = r.id;
		if (!zip || !id) continue;
		let doc;
		try { doc = await db.read('dues', id); } catch { doc = null; }
		paidMap.set(String(zip), { method, id, timestamp: doc?.timestamp, datestring: doc?.datestring });
	}

	return { props: { members, selectedYear, years, paid: Object.fromEntries(paidMap) } };
}

export const actions = {
	mark: async ({ request, cookies }) => {
		const attendance_auth = cookies.get('attendance_auth');
		if (attendance_auth !== 'true') {
			return fail(401, { success: false, message: 'You are not authenticated.' });
		}

		const form = await request.formData();
		const zip = (form.get('zip') ?? '').toString();
		const method = (form.get('method') ?? 'other').toString();
		const amount = 15;
		const tz = (form.get('timezone') ?? 'America/Chicago').toString();
		if (!zip) return fail(400, { success: false, message: 'Missing member zip.' });

		const now = new Date();
		const doc = {
			zip,
			amount,
			method, // 'cash' | 'online' | 'other'
			timestamp: now.toISOString(),
			datestring: now.toLocaleString('en-US', { timeZone: tz })
		};

		const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
		const res = await db.append('dues', doc);
		if (!res || !res.ok) return fail(500, { success: false, message: 'Failed to save dues record.' });
		return { success: true, message: 'Dues recorded.' };
	},
	delete: async ({ request, cookies }) => {
		const attendance_auth = cookies.get('attendance_auth');
		if (attendance_auth !== 'true') {
			return fail(401, { success: false, message: 'You are not authenticated.' });
		}
		const form = await request.formData();
		const id = (form.get('id') ?? '').toString();
		if (!id) return fail(400, { success: false, message: 'Missing record id.' });
		const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
		const res = await db.delete('dues', id);
		if (!res || !res.ok) return fail(500, { success: false, message: 'Failed to delete dues record.' });
		return { success: true, message: 'Dues record removed.' };
	}
};
