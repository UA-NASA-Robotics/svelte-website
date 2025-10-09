import type { Cookies } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Database } from '../../../../components/Database';

type CountKey = string | [string, string | number];
type CountRow = { key: CountKey; value: number };
type CountResult = { rows?: CountRow[] } | null;

type MemberDoc = {
  _id?: string;
  name?: string;
  isMember?: boolean;
  subTeam?: string;
  demographics?: { email?: string; updated?: number };
};
type AllDocs = { rows?: Array<{ id: string; doc?: MemberDoc }>; } | null;

const ONE_YEAR_MS = 31536000000;

// School year logic: Aug (8)–Dec roll up to next calendar year value
function schoolYearFromDate(d: Date): number {
  const yr = d.getFullYear();
  const m = d.getMonth() + 1; // 1-12
  return m >= 6 ? yr + 1 : yr;
}

function matchesSchoolYear(dateStr: string, schoolYear: string): boolean {
  const sy = Number(schoolYear);
  if (!sy) return false;
  const s = String(dateStr || '').trim();
  if (!s) return false;
  // Parse with Date first
  const d = new Date(s);
  if (!isNaN(d.getTime())) return schoolYearFromDate(d) === sy;
  // Fallback: try to extract MM and YYYY from common formats
  // Examples: 9/9/2025, 09-09-2025, 2025-09-09
  // Prefer a month-first pattern
  const mdY = s.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/);
  if (mdY) {
    const month = Number(mdY[1]);
    const year = Number(mdY[3]);
    const calc = month >= 8 ? year + 1 : year;
    return calc === sy;
  }
  // ISO leading year; assume Jan–Jul stay same year, Aug–Dec roll
  const yOnly = s.match(/\b(\d{4})\b/);
  if (yOnly) {
    const year = Number(yOnly[1]);
    // Without a month we can't be precise; assume matches if either direct or previous-year-to-next roll
    return year === sy || year + 1 === sy;
  }
  return false;
}

export async function load({ cookies, url }: { cookies: Cookies; url: URL }) {
  const attendance_auth = cookies.get('attendance_auth');
  if (attendance_auth !== 'true') {
    throw redirect(303, '/attendance/login');
  }

  const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
  // Load dues data to mark who is paid for selectedYear (after selectedYear is known)

  // Available years for filtering (from view unique_years)
  const yearsRes: { rows?: Array<{ key?: string | number }> } | null = await db.read(
    'attendance',
    '_design/stats/_view/unique_years?group=true'
  );
  const years: string[] = (yearsRes?.rows ?? [])
    .map((r) => (r?.key != null ? String(r.key) : ''))
    .filter((y) => y)
    .sort()
    .reverse();
  const selectedYear = (url.searchParams.get('year') || '').trim();

  // Get attendance counts by zip
  const countsRes: CountResult = await db.read('attendance', '_design/stats/_view/count_by_zip?group=true');
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
      countsMap.set(r.key, val);
    }
  }

  // If years list is empty but counts contain [zip, year], derive years from rows
  if (years.length === 0) {
    const ys = new Set<string>();
    for (const r of countsRes?.rows ?? []) {
      if (Array.isArray(r.key)) {
        const yearStr = String(r.key[1]);
        if (yearStr) ys.add(yearStr);
      }
    }
    if (ys.size) {
      years.push(...Array.from(ys).sort().reverse());
    }
  }

  // Load dues data using CouchDB view dues_by_zip_year
  const paidMap = new Map<string, boolean>();
  if (selectedYear) {
    const yearNum = Number(selectedYear);
    const start = encodeURIComponent(JSON.stringify(["", yearNum]));
    const end = encodeURIComponent(JSON.stringify([{}, yearNum]));
    const viewPath = `_design/stats/_view/dues_by_zip_year?group=true&startkey=${start}&endkey=${end}`;
    const duesRows: { rows?: Array<{ key: [string, number]; value: number }> } | null = await db.read(
      'dues',
      viewPath
    );
    for (const r of duesRows?.rows ?? []) {
      const [zip] = r.key;
      if (zip) paidMap.set(String(zip), (Number(r.value) || 0) > 0);
    }
  } else {
    // No specific year selected: mark paid if any dues exist across years
    const duesRows: { rows?: Array<{ key: string; value: number }> } | null = await db.read(
      'dues',
      '_design/stats/_view/dues_by_zip_year?group_level=1'
    );
    for (const r of duesRows?.rows ?? []) {
      if (r.key) paidMap.set(String(r.key), (Number(r.value) || 0) > 0);
    }
  }

  // Get members to enrich with name/subTeam/email and active flag
  const allDocs: AllDocs = await db.read('members', '_all_docs?include_docs=true');

  const now = Date.now();
  const active: Array<{ zip: string; name: string; subTeam: string; email: string; count: number; duesPaid?: boolean }>=[];
  const inactive: Array<{ zip: string; name: string; subTeam: string; email: string; count: number; duesPaid?: boolean }>=[];

  for (const row of allDocs?.rows ?? []) {
    const doc = row.doc ?? {};
    if (!doc || doc.isMember !== true) continue;
    const zip = row.id;
    const count = countsMap.get(zip) ?? 0;
    const name = doc.name ?? zip;
    const subTeam = doc.subTeam ?? '';
    const email = doc.demographics?.email ?? '';
    const updated = doc.demographics?.updated;
  const record = { zip, name, subTeam, email, count, duesPaid: !!paidMap.get(zip) };

    if (typeof updated === 'number' && now - updated <= ONE_YEAR_MS) {
      active.push(record);
    } else {
      inactive.push(record);
    }
  }

  // Sort: by count desc then name asc
  const sorter = (a: typeof active[number], b: typeof active[number]) =>
    b.count - a.count || a.name.localeCompare(b.name);
  active.sort(sorter);
  inactive.sort(sorter);

  // If filtering by year and we didn't have per-year counts, recompute by fetching dates per zip
  if (selectedYear && !usedDedupByYear) {
    const updateCountsFor = async (list: typeof active) => {
      await Promise.all(
        list.map(async (m) => {
          try {
            const key = encodeURIComponent(JSON.stringify(m.zip));
            const res = await db.read('attendance', `_design/stats/_view/dates_by_zip?key=${key}`);
            const rows = Array.isArray((res as any)?.rows) ? (res as any).rows : [];
            const dates: string[] = rows.map((r: any) => String(r.value));
            m.count = dates.filter((d) => matchesSchoolYear(d, selectedYear)).length;
          } catch {
            m.count = 0;
          }
        })
      );
      // re-sort after updating counts
      list.sort(sorter);
    };

    await Promise.all([updateCountsFor(active), updateCountsFor(inactive)]);
  }

  return { props: { active, inactive, years, selectedYear } };
}
