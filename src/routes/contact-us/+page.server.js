import { fail } from '@sveltejs/kit';
import { Database } from '../../components/Database';

/** @type {import('./$types').Actions} */
export const actions = {
	contact_submission: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name');
		const email = data.get('email');
		const message = data.get('message');

		if (!name) {
			return fail(400, { name, missing: true });
		}
		if (!email) {
			return fail(400, { email, missing: true });
		}
		if (!message) {
			return fail(400, { message, missing: true });
		}

		let db = new Database('leboeuflasing.ddns.net:5984', 'contact', 'lunaboticswebsitecontact');
		let responce = await db.append('contact', { name: name, email: email, message: message });
		console.log(responce);

		if (responce.ok) {
			return { success: true };
		} else {
			return fail(400, { error: responce });
		}
	}
};

//user: contact pass: lunaboticswebsitecontact
