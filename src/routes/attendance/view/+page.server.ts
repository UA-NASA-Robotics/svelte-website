import type { Cookies } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Database } from '../../../components/Database';
import { getCurrentSchoolYear } from '../schoolYear';

type Row = { key: string | number; value: number };
type AnyRow = { key: unknown; value: number };
type ViewResult = { rows?: AnyRow[] } | null;

async function fetchViewForYear(db: Database, viewName: string, year?: string): Promise<Row[]> {
    // Demographics views emit [category, schoolYear] keys derived from demographics.updated.
    const res: ViewResult = await db.read('members', `_design/stats/_view/${viewName}?group_level=2`);
    const rows = res?.rows ?? [];

    // Aggregate by category for the requested school year.
    const agg = new Map<string, number>();
    for (const r of rows) {
        const val = Number((r as any).value) || 0;
        let include = true;
        let category: string | number | null | undefined;

        if (Array.isArray((r as any).key)) {
            const [cat, y] = (r as any).key as [unknown, unknown];
            if (year) include = String(y ?? '') === year;
            category = (cat as any) ?? 'Unknown';
        } else {
            // Legacy fallback for older views that only emit category keys.
            category = (r as any).key as any;
        }

        if (!include) continue;
        const catKey = category == null || category === '' ? 'Unknown' : String(category);
        agg.set(catKey, (agg.get(catKey) || 0) + val);
    }

    return Array.from(agg.entries())
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => b.value - a.value);
}

export async function load({ cookies }: { cookies: Cookies }) {
    const attendance_auth = cookies.get('attendance_auth');
    if (attendance_auth !== 'true') {
        throw redirect(303, '/attendance/login');
    }

    const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');

    const schoolYear = String(getCurrentSchoolYear());

    // Fetch demographics for the current school year.
    const [gender, major, yearsOnTeam, ethnicity, isHispanic] = await Promise.all([
        fetchViewForYear(db, 'gender', schoolYear),
        fetchViewForYear(db, 'major', schoolYear),
        fetchViewForYear(db, 'yearsOnTeam', schoolYear),
        fetchViewForYear(db, 'ethnicity', schoolYear),
        fetchViewForYear(db, 'isHispanic', schoolYear)
    ]);

    // Fallback for years panel if yearsOnTeam is empty: use age view (also filtered when the view is year-keyed)
    const years = yearsOnTeam && yearsOnTeam.length
        ? yearsOnTeam
        : await fetchViewForYear(db, 'age', schoolYear);

    return {
        props: {
            gender,
            major,
            years,
            ethnicity,
            isHispanic,
            schoolYear: parseInt(schoolYear)
        }
    };
}
