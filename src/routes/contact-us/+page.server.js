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
			return fail(400, {error: "Missing Name" });
		}
		if (!email) {
			return fail(400, { error: "Missing Email"});
		}
		if (!message) {
			return fail(400, { error: "Missing Message"});
		}

		let db = new Database('leboeuflasing.ddns.net:5984', 'contact', 'lunaboticswebsitecontact');
		let response = await db.append('contact', { name: name, email: email, message: message, time: new Date().toISOString()});

		if (response.ok) {
			return { success: true , data: { name }};
		} else {
			return fail(400, { error: "Database Connection Error" });
		}
	}
};
