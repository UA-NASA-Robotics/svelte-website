import type { Cookies } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Database } from '../../../components/Database';

type Row = { key: string | number; value: number };
type ViewResult = { rows?: Row[] } | null;

async function fetchView(db: Database, viewName: string): Promise<Row[]> {
    const res: ViewResult = await db.read('members', `_design/stats/_view/${viewName}?group=true`);
    if (!res || !res.rows) return [];
    // Normalize keys to string for UI; keep original numeric age if needed
    return res.rows
        .filter((r): r is Row => r !== null && typeof r === 'object' && 'key' in r && 'value' in r)
        .map((r) => ({ key: r.key, value: Number(r.value) || 0 }))
        .sort((a, b) => b.value - a.value);
}

export async function load({ cookies }: { cookies: Cookies }) {
    const attendance_auth = cookies.get('attendance_auth');
    if (attendance_auth !== 'true') {
        throw redirect(303, '/attendance/login');
    }

    const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');

    // Fetch common demographics views. Use yearsOnTeam (preferred), fallback to age if yearsOnTeam view doesn't exist.
    const [gender, major, yearsOnTeam] = await Promise.all([
        fetchView(db, 'gender'),
        fetchView(db, 'major'),
        fetchView(db, 'yearsOnTeam')
    ]);

    const years = yearsOnTeam && yearsOnTeam.length ? yearsOnTeam : await fetchView(db, 'age');

    return {
        props: {
            gender,
            major,
            years
        }
    };
}
