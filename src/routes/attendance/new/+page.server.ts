
import type { Cookies } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { Database } from '../../../components/Database';
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
    new_submission: async ({ request, cookies }) => {
        const data = await request.formData();
        const name = data.get('name') as string;
        const zipData = data.get('zip') as string;
        const zip = zipData.trim();
        const subTeam = data.get("subteam") as string;
        const authenticated = cookies.get('attendance_auth');
        if (authenticated === 'true') {
            //we can login, check db for existing zip
            let db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
            let response = await db.read('members', zip as string);
            if (response && "isMember" in response){
                //member exists, we append an attendance record
                return fail(500, { success: false, message: "Duplicate member record found, please contact an admin."});

            }else{
                //append a new attendance record
                let newMember = {
                    _id: zip,
                    isMember: true,
                    joined_timestamp: new Date().toISOString(),
                    name: name,
                    subTeam: subTeam,
                    zip: zip
                };
                let createResponse = await db.append("members", newMember);
                if (createResponse && "ok" in createResponse && createResponse.ok){
                    redirect(303, '/attendance');
                    return { success: true, message: "Attendance recorded successfully."};

            }else{
                return fail(500, { success: false, message: "Error appending record."});
            }
        }
        }else { 
            return fail(401, { success: false, message: "You are not authenticated, please login first."});
        }
    },
};