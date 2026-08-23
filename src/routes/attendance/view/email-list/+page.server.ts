import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	archiveEmailSignupRecords,
	createClubDatabase,
	deleteEmailArchive,
	deleteEmailSignupRecords,
	formatMailingListForOutlook,
	loadEmailArchives,
	loadEmailSignupRecords,
	parseBulkEmailInput,
	readEmailSignupStatus,
	restoreEmailArchive,
	updateEmailSignupStatus
} from '$lib/server/emailSignup';

function ensureAttendanceAuth(attendanceAuth: string | undefined) {
	if (attendanceAuth !== 'true') {
		throw redirect(303, '/attendance/login');
	}
}

export const load: PageServerLoad = async ({ cookies }) => {
	ensureAttendanceAuth(cookies.get('attendance_auth'));

	const [status, records, archives] = await Promise.all([
		readEmailSignupStatus(),
		loadEmailSignupRecords(),
		loadEmailArchives()
	]);

	return {
		props: {
			enabled: status.enabled,
			records,
			copyAllText: formatMailingListForOutlook(records),
			archives
		}
	};
};

export const actions: Actions = {
	toggle: async ({ request, cookies }) => {
		ensureAttendanceAuth(cookies.get('attendance_auth'));

		const formData = await request.formData();
		const enabled = (formData.get('enabled') ?? '').toString() === 'true';
		const result = await updateEmailSignupStatus(enabled);

		if (!result || !('ok' in result) || !result.ok) {
			return fail(500, {
				error: 'Unable to update the signup status.'
			});
		}

		return {
			success: true,
			message: enabled ? 'Public email signup is now enabled.' : 'Public email signup is now disabled.'
		};
	},

	delete: async ({ request, cookies }) => {
		ensureAttendanceAuth(cookies.get('attendance_auth'));

		const formData = await request.formData();
		const id = (formData.get('id') ?? '').toString().trim();

		if (!id) {
			return fail(400, {
				error: 'Missing email record id.'
			});
		}

		const result = await createClubDatabase().delete('email', id);
		if (!result || !('ok' in result) || !result.ok) {
			return fail(500, {
				error: 'Unable to delete this email record.'
			});
		}

		return {
			success: true,
			message: 'Email record removed.'
		};
	},

	archive: async ({ cookies }) => {
		ensureAttendanceAuth(cookies.get('attendance_auth'));

		const records = await loadEmailSignupRecords();
		if (!records.length) {
			return fail(400, {
				error: 'There are no active email records to archive.'
			});
		}

		const archiveId = await archiveEmailSignupRecords(records);
		if (!archiveId) {
			return fail(500, {
				error: 'Unable to create the email archive. Active records were not changed.'
			});
		}

		const deletedCount = await deleteEmailSignupRecords(records);
		if (deletedCount !== records.length) {
			return fail(500, {
				error: `Archive ${archiveId} was created, but only ${deletedCount} of ${records.length} active records were removed.`
			});
		}

		return {
			success: true,
		message: `Archived ${records.length} email${records.length === 1 ? '' : 's'} and cleared the active list.`
		};
	},

	delete_archive: async ({ request, cookies }) => {
		ensureAttendanceAuth(cookies.get('attendance_auth'));

		const formData = await request.formData();
		const id = (formData.get('id') ?? '').toString().trim();
		if (!id || id.startsWith('_design')) {
			return fail(400, { error: 'Missing archive id.' });
		}

		const result = await deleteEmailArchive(id);
		if (!result || !('ok' in result) || !result.ok) {
			return fail(500, { error: 'Unable to delete this email archive.' });
		}

		return { success: true, message: 'Email archive deleted.' };
	},

	restore_archive: async ({ request, cookies }) => {
		ensureAttendanceAuth(cookies.get('attendance_auth'));

		const formData = await request.formData();
		const id = (formData.get('id') ?? '').toString().trim();
		if (!id || id.startsWith('_design')) {
			return fail(400, { error: 'Missing archive id.' });
		}

		const archive = (await loadEmailArchives()).find((entry) => entry.id === id);
		if (!archive) {
			return fail(404, { error: 'Email archive not found.' });
		}

		const restoredCount = await restoreEmailArchive(archive);
		if (restoredCount !== archive.records.length) {
			return fail(500, {
				error: `Restored ${restoredCount} of ${archive.records.length} records from the archive.`
			});
		}

		return {
			success: true,
		message: `Copied ${restoredCount} email${restoredCount === 1 ? '' : 's'} back to the active list.`
		};
	},

	bulk_add: async ({ request, cookies }) => {
		ensureAttendanceAuth(cookies.get('attendance_auth'));

		const formData = await request.formData();
		const emails = (formData.get('emails') ?? '').toString();

		if (!emails.trim()) {
			return fail(400, {
				error: 'Paste at least one email address.',
				bulkValue: emails
			});
		}

		const { valid, invalid } = parseBulkEmailInput(emails);
		if (!valid.length) {
			return fail(400, {
				error: 'No valid @uakron.edu addresses were found.',
				invalidEmails: invalid,
				bulkValue: emails
			});
		}

		const db = createClubDatabase();
		const createdAt = new Date().toISOString();
		const results = await Promise.all(
			valid.map((email) =>
				db.append('email', {
					name: '',
					email,
					major: '',
					source: 'admin-bulk',
					createdAt
				})
			)
		);

		const successCount = results.filter((result) => result && 'ok' in result && result.ok).length;
		if (!successCount) {
			return fail(500, {
				error: 'Unable to add the provided email addresses.',
				invalidEmails: invalid,
				bulkValue: emails
			});
		}

		const messageParts = [`Added ${successCount} email${successCount === 1 ? '' : 's'}.`];
		if (invalid.length) {
			messageParts.push(`Skipped ${invalid.length} invalid address${invalid.length === 1 ? '' : 'es'}.`);
		}

		return {
			success: true,
			message: messageParts.join(' '),
			invalidEmails: invalid,
			bulkValue: ''
		};
	}
};