import type { Cookies } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Database } from '../../../../components/Database';

type MemberDoc = {
  _id?: string;
  name?: string;
  isMember?: boolean;
  subTeam?: string;
  demographics?: { email?: string; updated?: number };
};

type AllDocs = {
  rows?: Array<{ id: string; doc?: MemberDoc }>;
} | null;

const ONE_YEAR_MS = 31536000000; // 365 days

export async function load({ cookies }: { cookies: Cookies }) {
  const attendance_auth = cookies.get('attendance_auth');
  if (attendance_auth !== 'true') {
    throw redirect(303, '/attendance/login');
  }

  const db = new Database('leboeuflasing.com:5984', 'contact', 'lunaboticswebsitecontact');
  const allDocs: AllDocs = await db.read('members', '_all_docs?include_docs=true');

  const now = Date.now();
  const active: Array<{ id: string; name: string; email: string; subTeam: string }> = [];
  const inactive: Array<{ id: string; name: string; email: string; subTeam: string }> = [];

  for (const row of allDocs?.rows ?? []) {
    const doc = row.doc ?? {};
    if (!doc || doc.isMember !== true) continue;

    const id = row.id;
    const name = doc.name ?? id;
    const email = doc.demographics?.email ?? '';
    const subTeam = doc.subTeam ?? '';
    const updated = doc.demographics?.updated;

    const record = { id, name, email, subTeam };

    if (typeof updated === 'number' && now - updated <= ONE_YEAR_MS) {
      active.push(record);
    } else {
      inactive.push(record);
    }
  }

  // Sort alphabetically by name for consistency
  active.sort((a, b) => a.name.localeCompare(b.name));
  inactive.sort((a, b) => a.name.localeCompare(b.name));

  return {
    props: {
      active,
      inactive
    }
  };
}
