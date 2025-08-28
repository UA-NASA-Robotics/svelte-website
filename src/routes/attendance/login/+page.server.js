import { fail } from '@sveltejs/kit';
import { Database } from '../../../components/Database';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
    login_submission: async ({ cookies, request }) => {
        // Get the form data from the request
        const data = await request.formData();

        const password = data.get('password');
        const longLived = data.get('long-live') === 'on' ? true : false;

        //test against db
        if (!password) {
            return fail(400, { error: 'Missing Password' });
        }

        let db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
        let response = await db.read('keys', 'attendance');
        console.log(response);
        if (response.password) {
            if (response.password === password) {
                //set a cookie called attendance_auth to true
                cookies.set('attendance_auth', 'true', {
                    path: '/',
                    httpOnly: true, //accessible only by the server
                    sameSite: 'strict', //only sent for same site requests
                    maxAge: longLived ? 60 * 60 * 24 * 30 : 60 * 60 * 24 //24 hours
                });
                throw redirect(303, '/attendance');
                return { success: true };
            } else {
                return fail(400, { error: 'Incorrect Password' });
            }
        } else {
            return fail(400, { error: 'Database Connection Error' });
        }
    }
};
