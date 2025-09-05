import type { Cookies } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Database } from '../../../../components/Database';

type CountRow = { key: string; value: number };
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

function matchesYear(dateStr: string, year: string): boolean {
  const y = String(year);
  if (!y) return true;
  const s = String(dateStr || '').trim();
  if (!s) return false;
  // ISO-like starts with YYYY
  if (s.startsWith(y)) return true;
  // Look for 4-digit groups anywhere
  const groups = s.match(/\b(\d{4})\b/g);
  if (groups && groups.includes(y)) return true;
  // Fallback: try Date parsing
  const d = new Date(s);
  if (!isNaN(d.getTime())) return String(d.getUTCFullYear()) === y;
  return false;
}

export async function load({ cookies, url }: { cookies: Cookies; url: URL }) {
  const attendance_auth = cookies.get('attendance_auth');
  if (attendance_auth !== 'true') {
    throw redirect(303, '/attendance/login');
  }

  const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');

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
  for (const r of countsRes?.rows ?? []) {
    if (typeof r.key === 'string') countsMap.set(r.key, Number(r.value) || 0);
  }

  // Get members to enrich with name/subTeam/email and active flag
  const allDocs: AllDocs = await db.read('members', '_all_docs?include_docs=true');

  const now = Date.now();
  const active: Array<{ zip: string; name: string; subTeam: string; email: string; count: number }>=[];
  const inactive: Array<{ zip: string; name: string; subTeam: string; email: string; count: number }>=[];

  for (const row of allDocs?.rows ?? []) {
    const doc = row.doc ?? {};
    if (!doc || doc.isMember !== true) continue;
    const zip = row.id;
    const count = countsMap.get(zip) ?? 0;
    const name = doc.name ?? zip;
    const subTeam = doc.subTeam ?? '';
    const email = doc.demographics?.email ?? '';
    const updated = doc.demographics?.updated;
    const record = { zip, name, subTeam, email, count };

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

  // If filtering by year, recompute counts for that year by fetching dates per zip and filtering
  if (selectedYear) {
    const updateCountsFor = async (list: typeof active) => {
      await Promise.all(
        list.map(async (m) => {
          try {
            const key = encodeURIComponent(JSON.stringify(m.zip));
            const res = await db.read('attendance', `_design/stats/_view/dates_by_zip?key=${key}`);
            const rows = Array.isArray((res as any)?.rows) ? (res as any).rows : [];
            const dates: string[] = rows.map((r: any) => String(r.value));
            m.count = dates.filter((d) => matchesYear(d, selectedYear)).length;
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
