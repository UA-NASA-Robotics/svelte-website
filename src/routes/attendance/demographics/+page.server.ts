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
        yearsOnTeam: '',
        gender: '',
        major: '',
        ethnicity: '',
        isHispanic: ''
    } as { email: string; yearsOnTeam: string | number; gender: string; major: string; ethnicity: string; isHispanic: string };

    if (member && typeof member === 'object' && 'demographics' in member && member.demographics) {
        const d = member.demographics as Partial<typeof demographics & { age?: string | number }>;
        demographics = {
            email: d.email ?? '',
            yearsOnTeam: (d as any).yearsOnTeam ?? d.age ?? '',
            gender: d.gender ?? '',
            major: d.major ?? '',
            ethnicity: d.ethnicity ?? '',
            isHispanic: d.isHispanic ?? ''
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
        let email = (form.get('email') as string | null)?.trim() || '';
        let yearsRaw = (form.get('yearsOnTeam') as string | null)?.trim() || '';
        let gender = (form.get('gender') as string | null)?.trim() || '';
        let major = (form.get('major') as string | null)?.trim() || '';
        let ethnicity = (form.get('ethnicity') as string | null)?.trim() || '';
        let isHispanic = (form.get('isHispanic') as string | null)?.trim() || '';

        if (!zip) return fail(400, { success: false, message: 'Missing zip parameter.' });

        let yearsOnTeam: number | 'NA' = 'NA';
        if (yearsRaw) {
            const n = Number(yearsRaw);
            if (!Number.isFinite(n) || n < 0) {
                return fail(400, { success: false, message: 'Years on team must be a valid non-negative number.' });
            }
            yearsOnTeam = n;
        }

        // Default optional fields when left blank
        const PREFER_NOT = 'Prefer not to say';
        if (!ethnicity) ethnicity = PREFER_NOT;
        if (!isHispanic) isHispanic = PREFER_NOT;
        if (!email) email = '';
        if (!gender) gender = PREFER_NOT;
        if (!major) major = PREFER_NOT;

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
                yearsOnTeam,
                gender,
                major,
                ethnicity,
                isHispanic,
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