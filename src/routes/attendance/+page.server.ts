import type { Cookies } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { Database } from '../../components/Database';
import { createLoginDoc, needsDemographics } from '../attendance/loginhelper';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }: { cookies: Cookies }) {
    const attendance_auth = cookies.get('attendance_auth');
    if (attendance_auth === 'true') {
        return {
            props: { authenticated: true }
        };
    } else {
        redirect(303, '/attendance/login');
        return {
            props: { authenticated: false }
        };
    }
}



/** @type {import('./$types').Actions} */
export const actions = {
    scan_submission: async ({ request, cookies }) => {
        const data = await request.formData();
        const zipData = data.get('zip') as string || "+000?";
        // if "E" in data, it's an error code from the scanner
        if (zipData.includes("E")) {
            return fail(400, { success: false, message: "Error reading card, please try again. Swipe reasonably slow." });
        }
        let zip: string | undefined = undefined;
        try{
             zip = zipData.split("+")[1].split("?")[0]; //parse the zip from the scanned data
        } catch {
            return fail(400, { success: false, message: "Error: Use a zip card. ඞඞ amogus. " });
        }
        const authenticated = cookies.get('attendance_auth');
        if (authenticated === 'true') {
            //we can login, check db for existing zip
            let db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
            let response = await db.read('members', zip as string);

            //we append an attendance record
            let success = await createLoginDoc(db, zip);

            if (response && "isMember" in response) {
                if (needsDemographics(response)) {
                    throw redirect(303, '/attendance/demographics?zip=' + zip);
                }

                if (success) {
                    return { success: true, message: "Attendance recorded successfully, " + response.name + "!" };
                } else {
                    return fail(500, { success: false, message: "Failed to append attendance record, please try again later." });
                }
            }
            else {
                //redirect to new member page with zip prefilled
                throw redirect(303, '/attendance/new?zip=' + zip);
            }
        } else {
            return fail(401, { success: false, message: "You are not authenticated, please login first." });
        }
    },
};

