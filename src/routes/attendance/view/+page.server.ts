import type { Cookies } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Database } from '../../../components/Database';
import { getCurrentSchoolYear } from '../schoolYear';

type Row = { key: string | number; value: number };
type AnyRow = { key: unknown; value: number };
type ViewResult = { rows?: AnyRow[] } | null;

async function fetchViewRows(db: Database, viewName: string): Promise<AnyRow[]> {
    // Demographics views emit [category, schoolYear] keys derived from demographics.updated.
    const res: ViewResult = await db.read('members', `_design/stats/_view/${viewName}?group_level=2`);
    return res?.rows ?? [];
}

function aggregateRowsForYear(rows: AnyRow[], year?: string): Row[] {
    const agg = new Map<string, number>();

    for (const r of rows) {
        const val = Number((r as any).value) || 0;
        let include = true;
        let category: string | number | null | undefined;

        if (Array.isArray((r as any).key)) {
            const [cat, rowYear] = (r as any).key as [unknown, unknown];
            if (year) include = String(rowYear ?? '') === year;
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

function getAvailableYears(...rowGroups: AnyRow[][]): string[] {
    const years = new Set<string>();

    for (const rows of rowGroups) {
        for (const row of rows) {
            if (!Array.isArray((row as any).key)) continue;
            const [, year] = (row as any).key as [unknown, unknown];
            const schoolYear = String(year ?? '').trim();
            if (schoolYear) years.add(schoolYear);
        }
    }

    return Array.from(years).sort((a, b) => Number(b) - Number(a) || b.localeCompare(a));
}

export async function load({ cookies, url }: { cookies: Cookies; url: URL }) {
    const attendance_auth = cookies.get('attendance_auth');
    if (attendance_auth !== 'true') {
        throw redirect(303, '/attendance/login');
    }

    const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');

    const currentSchoolYear = String(getCurrentSchoolYear());
    const urlYear = url.searchParams.get('year')?.trim() || '';
    const selectedYear = urlYear || currentSchoolYear;

    const [genderRows, majorRows, yearsOnTeamRows, ethnicityRows, isHispanicRows, ageRows] =
        await Promise.all([
            fetchViewRows(db, 'gender'),
            fetchViewRows(db, 'major'),
            fetchViewRows(db, 'yearsOnTeam'),
            fetchViewRows(db, 'ethnicity'),
            fetchViewRows(db, 'isHispanic'),
            fetchViewRows(db, 'age')
        ]);

    const [gender, major, yearsOnTeam, ethnicity, isHispanic] = [
        aggregateRowsForYear(genderRows, selectedYear),
        aggregateRowsForYear(majorRows, selectedYear),
        aggregateRowsForYear(yearsOnTeamRows, selectedYear),
        aggregateRowsForYear(ethnicityRows, selectedYear),
        aggregateRowsForYear(isHispanicRows, selectedYear)
    ];

    let availableYears = getAvailableYears(
        genderRows,
        majorRows,
        yearsOnTeamRows,
        ethnicityRows,
        isHispanicRows,
        ageRows
    );
    availableYears = Array.from(new Set([...availableYears, currentSchoolYear, selectedYear])).sort(
        (a, b) => Number(b) - Number(a) || b.localeCompare(a)
    );

    // Fallback for years panel if yearsOnTeam is empty: use age view (also filtered when the view is year-keyed)
    const years = yearsOnTeam && yearsOnTeam.length
        ? yearsOnTeam
        : aggregateRowsForYear(ageRows, selectedYear);

    return {
        props: {
            gender,
            major,
            years,
            ethnicity,
            isHispanic,
            availableYears,
            selectedYear
        }
    };
}
