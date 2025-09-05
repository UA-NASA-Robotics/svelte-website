import type { Cookies } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { Database } from '../../../components/Database';

export async function load({ cookies, url }: { cookies: Cookies; url: URL }) {
    // Auth check
    const attendance_auth = cookies.get('attendance_auth');
    if (attendance_auth !== 'true') {
        redirect(303, '/attendance/login');
    }

    // Zip from query string
    const zip = (url.searchParams.get('zip') || '').trim();
    if (!zip) {
        redirect(303, '/attendance/new');
    }

    // Pull existing member and demographics
    const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
    const member = await db.read('members', zip);

    let demographics = {
        email: '',
        age: '',
        gender: '',
        major: ''
    } as { email: string; age: string | number; gender: string; major: string };

    if (member && typeof member === 'object' && 'demographics' in member && member.demographics) {
        const d = member.demographics as Partial<typeof demographics>;
        demographics = {
            email: d.email ?? '',
            age: d.age ?? '',
            gender: d.gender ?? '',
            major: d.major ?? ''
        };
    }

    // Return data to the page
    return {
        props: {
            authenticated: true,
            zip,
            demographics
        }
    };
}

/** @type {import('./$types').Actions} */
export const actions = {
    save_demographics: async ({ request, cookies }) => {
        const attendance_auth = cookies.get('attendance_auth');
        if (attendance_auth !== 'true') {
            return fail(401, { success: false, message: 'You are not authenticated, please login first.' });
        }

        const form = await request.formData();
        const zip = (form.get('zip') as string | null)?.trim() || '';
        const email = (form.get('email') as string | null)?.trim() || '';
        const ageRaw = (form.get('age') as string | null)?.trim() || '';
        const gender = (form.get('gender') as string | null)?.trim() || '';
        const major = (form.get('major') as string | null)?.trim() || '';

        if (!zip) return fail(400, { success: false, message: 'Missing zip parameter.' });

        // Basic validation
        if (!email || !gender || !major) {
            return fail(400, { success: false, message: 'Please fill out all required fields.' });
        }

        let age: number | '' = '';
        if (ageRaw) {
            const n = Number(ageRaw);
            if (!Number.isFinite(n) || n < 0) {
                return fail(400, { success: false, message: 'Age must be a valid non-negative number.' });
            }
            age = n;
        }

        // Read existing member
        const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
        const member = await db.read('members', zip);

        if (!member || typeof member !== 'object' || !('_id' in member)) {
            return fail(404, { success: false, message: 'Member not found. Please start again.' });
        }

        // Merge and save demographics onto the member doc
        const updated = {
            ...member,
            demographics: {
                email,
                age,
                gender,
                major,
                //add a timestamp in ms
                updated: Date.now()
            }
        };

        // Assuming db.append updates when _id exists (CouchDB-style with _rev)
        const saved = await db.append('members', updated);
        if (!saved || !('ok' in saved) || !saved.ok) {
            return fail(500, { success: false, message: 'Error saving demographics.' });
        }

        // Redirect to a simple confirmation (adjust as desired)
        redirect(303, `/attendance/?demographics=1`);
    }
};