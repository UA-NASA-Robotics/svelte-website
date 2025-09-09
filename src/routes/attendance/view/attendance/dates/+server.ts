import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { Database } from '../../../../../components/Database';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const attendance_auth = cookies.get('attendance_auth');
  if (attendance_auth !== 'true') {
    return new Response('Unauthorized', { status: 401 });
  }

  const zip = (url.searchParams.get('zip') || '').trim();
  const year = (url.searchParams.get('year') || '').trim();
  if (!zip) return json({ rows: [] });

  const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
  const key = encodeURIComponent(JSON.stringify(zip));
  const res = await db.read('attendance', `_design/stats/_view/dates_by_zip?key=${key}`);
  // Expect { rows: [{ value: 'date string', ...}] }
  const rows = Array.isArray(res?.rows) ? res.rows : [];
  let dates: string[] = rows.map((r: any) => String(r.value));
  if (year) {
    const schoolYearFromDate = (d: Date) => {
      const yr = d.getFullYear();
      const m = d.getMonth() + 1; // 1-12
      return m >= 8 ? yr + 1 : yr;
    };
    const matchesSchoolYear = (s: string) => {
      const sy = Number(year);
      const v = String(s || '').trim();
      const dt = new Date(v);
      if (!isNaN(dt.getTime())) return schoolYearFromDate(dt) === sy;
      const mdY = v.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/);
      if (mdY) {
        const month = Number(mdY[1]);
        const yr = Number(mdY[3]);
        return (month >= 8 ? yr + 1 : yr) === sy;
      }
      const yOnly = v.match(/\b(\d{4})\b/);
      if (yOnly) {
        const yr = Number(yOnly[1]);
        return yr === sy || yr + 1 === sy;
      }
      return false;
    };
    dates = dates.filter(matchesSchoolYear);
  }
  return json({ dates });
};
