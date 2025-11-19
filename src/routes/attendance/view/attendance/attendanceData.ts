import type { Database } from '../../../../components/Database';
import { matchesSchoolYear } from './attendanceHelpers';

type CountKey = string | [string, string | number];
type CountRow = { key: CountKey; value: number };
type CountResult = { rows?: CountRow[] } | null;

/**
 * Get attendance counts per member for a specific year (or all years if null)
 * Returns a Map of zip -> count
 */
export async function getAttendanceCounts(
	db: Database,
	selectedYear: string | null
): Promise<{ countsMap: Map<string, number>; usedDedupByYear: boolean }> {
	const countsRes: CountResult = await db.read(
		'attendance',
		'_design/stats/_view/count_by_zip?group=true'
	);
	const countsMap = new Map<string, number>();
	let usedDedupByYear = false;

	for (const r of countsRes?.rows ?? []) {
		const val = Number(r.value) || 0;
		if (Array.isArray(r.key)) {
			// New deduplicated format: [zip, year]
			const [zip, year] = r.key;
			const zipStr = String(zip);
			const yearStr = String(year);
			usedDedupByYear = true;
			if (!selectedYear || selectedYear === yearStr) {
				countsMap.set(zipStr, (countsMap.get(zipStr) || 0) + val);
			}
		} else if (typeof r.key === 'string') {
			// Legacy format: per-zip totals
			if (!selectedYear) {
				countsMap.set(r.key, val);
			}
		}
	}

	return { countsMap, usedDedupByYear };
}

/**
 * Fallback method for when per-year counts aren't available
 * Fetches all dates for a member and filters by school year
 */
export async function getCountForMemberByYear(
	db: Database,
	zip: string,
	selectedYear: string
): Promise<number> {
	try {
		const key = encodeURIComponent(JSON.stringify(zip));
		const res = await db.read('attendance', `_design/stats/_view/dates_by_zip?key=${key}`);
		const rows = Array.isArray((res as any)?.rows) ? (res as any).rows : [];
		const dates: string[] = rows.map((r: any) => String(r.value));
		return dates.filter((d) => matchesSchoolYear(d, selectedYear)).length;
	} catch {
		return 0;
	}
}

/**
 * Get available years from the attendance database
 */
export async function getAvailableYears(db: Database): Promise<string[]> {
	const yearsRes: { rows?: Array<{ key?: string | number }> } | null = await db.read(
		'attendance',
		'_design/stats/_view/unique_years?group=true'
	);
	const years: string[] = (yearsRes?.rows ?? [])
		.map((r) => (r?.key != null ? String(r.key) : ''))
		.filter((y) => y)
		.sort()
		.reverse();
	return years;
}
