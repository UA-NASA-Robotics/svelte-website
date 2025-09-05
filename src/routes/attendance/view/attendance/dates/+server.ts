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
    const matchesYear = (s: string) => {
      const y = String(year);
      const v = String(s || '').trim();
      if (v.startsWith(y)) return true;
      const g = v.match(/\b(\d{4})\b/g);
      if (g && g.includes(y)) return true;
      const dt = new Date(v);
      return !isNaN(dt.getTime()) && String(dt.getUTCFullYear()) === y;
    };
    dates = dates.filter(matchesYear);
  }
  return json({ dates });
};
