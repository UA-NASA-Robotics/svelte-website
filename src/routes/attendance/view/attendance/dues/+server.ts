import type { Cookies } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';
import { Database } from '../../../../../components/Database';

export async function GET({ cookies, url }: { cookies: Cookies; url: URL }) {
  const attendance_auth = cookies.get('attendance_auth');
  if (attendance_auth !== 'true') {
    throw redirect(303, '/attendance/login');
  }

  const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
  const yearParam = (url.searchParams.get('year') || '').trim();

  if (yearParam) {
    const yearNum = Number(yearParam);
    const ykey = encodeURIComponent(JSON.stringify([yearNum]));
    const rows: any = await db.read('dues', `_design/stats/_view/zip_by_year?startkey=${ykey}&endkey=${ykey}`);
    const paid: Record<string, { method: string }> = {};
    for (const r of rows?.rows ?? []) {
      const val = r.value || [];
      const zip = val[0];
      const method = val[1] || 'other';
      if (zip) paid[String(zip)] = { method };
    }
    return json({ paid, years: [yearParam] });
  }

  // No year provided: return paid info for all available years
  const yearsRows: any = await db.read('dues', `_design/stats/_view/dues_by_zip_year?group=true`);
  const yearsSet = new Set<string>();
  for (const r of yearsRows?.rows ?? []) {
    const key = r.key;
    if (Array.isArray(key) && key.length >= 2) yearsSet.add(String(key[1]));
  }
  const years = Array.from(yearsSet).sort();

  const paidByYear: Record<string, Record<string, { method: string }>> = {};
  for (const y of years) {
    const yearNum = Number(y);
    const ykey = encodeURIComponent(JSON.stringify([yearNum]));
    const rows: any = await db.read('dues', `_design/stats/_view/zip_by_year?startkey=${ykey}&endkey=${ykey}`);
    const paid: Record<string, { method: string }> = {};
    for (const r of rows?.rows ?? []) {
      const val = r.value || [];
      const zip = val[0];
      const method = val[1] || 'other';
      if (zip) paid[String(zip)] = { method };
    }
    paidByYear[y] = paid;
  }

  return json({ years, paidByYear });
}
