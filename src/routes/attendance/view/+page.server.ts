import type { Cookies } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Database } from '../../../components/Database';

type Row = { key: string | number; value: number };
type AnyRow = { key: unknown; value: number };
type ViewResult = { rows?: AnyRow[] } | null;

async function getLatestYear(db: Database): Promise<string | undefined> {
    const yearsRes: { rows?: Array<{ key?: string | number }> } | null = await db.read(
        'attendance',
        '_design/stats/_view/unique_years?group=true'
    );
    const years: string[] = (yearsRes?.rows ?? [])
        .map((r) => (r?.key != null ? String(r.key) : ''))
        .filter(Boolean)
        .sort();
    return years.length ? years[years.length - 1] : undefined;
}

async function fetchViewForYear(db: Database, viewName: string, year?: string): Promise<Row[]> {
    // Use group_level=2 to get [category, year] keys if the view supports it
    const res: ViewResult = await db.read('members', `_design/stats/_view/${viewName}?group_level=2`);
    const rows = res?.rows ?? [];

    // Aggregate by category, filtering to the provided year if keys are [category, year]
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
            // Legacy: category-only keys
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

    // Determine the latest year (e.g., 2026) using attendance years
    const latestYear = await getLatestYear(db);

    // Fetch demographics for the latest year only (falls back gracefully if view lacks year component)
    const [gender, major, yearsOnTeam, ethnicity, isHispanic] = await Promise.all([
        fetchViewForYear(db, 'gender', latestYear),
        fetchViewForYear(db, 'major', latestYear),
        fetchViewForYear(db, 'yearsOnTeam', latestYear),
        fetchViewForYear(db, 'ethnicity', latestYear),
        fetchViewForYear(db, 'isHispanic', latestYear)
    ]);

    // Fallback for years panel if yearsOnTeam is empty: use age view (also filtered to latest year when applicable)
    const years = yearsOnTeam && yearsOnTeam.length
        ? yearsOnTeam
        : await fetchViewForYear(db, 'age', latestYear);

    const numLatestYear = latestYear ? parseInt(latestYear) : undefined;
    return {
        props: {
            gender,
            major,
            years,
            ethnicity,
            isHispanic,
            numLatestYear
        }
    };
}
