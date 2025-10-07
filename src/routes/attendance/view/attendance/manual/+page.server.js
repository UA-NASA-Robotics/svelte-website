import { redirect, fail } from '@sveltejs/kit';
import { Database } from '../../../../../components/Database';

export async function load({ cookies }) {
	const attendance_auth = cookies.get('attendance_auth');
	if (attendance_auth !== 'true') {
		throw redirect(303, '/attendance/login');
	}

	const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
	const allDocs = await db.read('members', '_all_docs?include_docs=true');

	const members = (allDocs?.rows ?? [])
		.map((r) => ({ id: r.id, ...(r.doc || {}) }))
		.filter((m) => m.isMember === true)
		.map((m) => ({
			zip: m._id || m.id,
			name: m.name || m._id || m.id,
			subTeam: m.subTeam || ''
		}))
		.sort((a, b) => a.name.localeCompare(b.name));

	return { props: { members } };
}

export const actions = {
	create: async ({ request, cookies }) => {
		const attendance_auth = cookies.get('attendance_auth');
		if (attendance_auth !== 'true') {
			return fail(401, { success: false, message: 'You are not authenticated.' });
		}

		const form = await request.formData();
		const date = (form.get('date') ?? '').toString().trim();
		const time = (form.get('time') ?? '').toString().trim();
		const timezone = (form.get('timezone') ?? 'America/Chicago').toString().trim();
		const zips = form.getAll('zip').map((z) => z.toString());

		if (!date || zips.length === 0) {
			return fail(400, { success: false, message: 'Please select a date and at least one member.' });
		}

		let isoTimestamp;
		try {
			const dateTimeStr = time ? `${date}T${time}` : `${date}T00:00`;
			const d = new Date(dateTimeStr);
			isoTimestamp = d.toISOString();
		} catch {
			return fail(400, { success: false, message: 'Invalid date/time.' });
		}

		const readable = new Date(isoTimestamp).toLocaleString('en-US', { timeZone: timezone });

		const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
		const results = await Promise.all(
			zips.map(async (zip) => {
				const doc = { zip, timestamp: isoTimestamp, datestring: readable, manualEntry: true };
				return db.append('attendance', doc);
			})
		);

		const okCount = results.filter((r) => r && 'ok' in r && r.ok).length;
		if (okCount !== zips.length) {
			return fail(500, { success: false, message: 'Some records could not be saved.', okCount, total: zips.length });
		}

		return { success: true, message: `Added ${okCount} attendance record(s).` };
	}
};
