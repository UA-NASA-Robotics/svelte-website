import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	createClubDatabase,
	isUakronEmail,
	loadMajorOptions,
	normalizeEmail,
	normalizeMajor,
	readEmailSignupStatus
} from '$lib/server/emailSignup';

function getSubmittedValues(formData: FormData) {
	return {
		name: (formData.get('name') ?? '').toString().trim(),
		email: (formData.get('email') ?? '').toString().trim(),
		major: (formData.get('major') ?? '').toString().trim(),
		customMajor: (formData.get('customMajor') ?? '').toString().trim()
	};
}

export const load: PageServerLoad = async () => {
	const [status, majorOptions] = await Promise.all([readEmailSignupStatus(), loadMajorOptions()]);

	return {
		props: {
			enabled: status.enabled,
			majorOptions
		}
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const values = getSubmittedValues(formData);

		if (!values.name) {
			return fail(400, {
				error: 'Name is required.',
				values
			});
		}

		if (!values.email) {
			return fail(400, {
				error: 'UAkron email is required.',
				values
			});
		}

		if (!isUakronEmail(values.email)) {
			return fail(400, {
				error: 'Email must end with @uakron.edu.',
				values
			});
		}

		const status = await readEmailSignupStatus();
		if (!status.enabled) {
			return fail(403, {
				error: 'Email signup is currently closed.',
				values
			});
		}

		const result = await createClubDatabase().append('email', {
			name: values.name,
			email: normalizeEmail(values.email),
			major: normalizeMajor(values.major, values.customMajor),
			source: 'public',
			createdAt: new Date().toISOString()
		});

		if (!result || !('ok' in result) || !result.ok) {
			return fail(500, {
				error: 'Unable to save your signup right now. Please try again later.',
				values
			});
		}

		return {
			success: true,
			message: `Thanks, ${values.name}. You have been added to the mailing list.`,
			values: {
				name: '',
				email: '',
				major: '',
				customMajor: ''
			}
		};
	}
};