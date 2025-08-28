import type { Cookies } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { Database } from '../../components/Database';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }: { cookies: Cookies }) {
    const attendance_auth = cookies.get('attendance_auth');
    if (attendance_auth === 'true') {
        return {
            props:{authenticated: true}
        };
    } else {
        redirect(303, '/attendance/login');
        return {
            props:{authenticated: false}
        };
    }
}



/** @type {import('./$types').Actions} */
export const actions ={
    scan_submission: async ({ request, cookies }) => {
        const data = await request.formData();
        const zipData = data.get('zip') as string || "+000?";
        // if "E" in data, it's an error code from the scanner
        if (zipData.includes("E")){
            return fail(400, { success: false, message: "Error reading card, please try again."});
        }
        const zip = zipData.split("+")[1].split("?")[0]; //parse the zip from the scanned data
        const authenticated = cookies.get('attendance_auth');
        if (authenticated === 'true') {
            //we can login, check db for existing zip
            let db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
            let response = await db.read('members', zip as string);
            if (response && "isMember" in response){
                //member exists, we append an attendance record
                let success = await db.append('attendance', {zip: zip, timestamp: new Date().toISOString(), datestring: new Date().toLocaleString("en-US", {timeZone: "America/Chicago"})});
                console.log(success);
                if (success.ok){
                    return { success: true, message: "Attendance recorded successfully, "+ response.name + "!"};
                }
                return fail(500, { success: false, message: "Failed to append attendance record, please try again later."});

            }else{
                //redirect to new member page with zip prefilled
                throw redirect(303, '/attendance/new?zip=' + zip);
            }
        }else { 
            return fail(401, { success: false, message: "You are not authenticated, please login first."});
        }
    },
};