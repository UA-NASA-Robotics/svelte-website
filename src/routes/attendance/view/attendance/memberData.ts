import type { Database } from '../../../../components/Database';
import type { MemberDoc, MemberRecord } from './attendanceHelpers';
import { isActiveMember } from './attendanceHelpers';

type AllDocs = { rows?: Array<{ id: string; doc?: MemberDoc }> } | null;

/**
 * Get all members from the database and enrich with attendance/dues/outreach data
 */
export async function getMembers(
	db: Database,
	countsMap: Map<string, number>,
	duesMap: Map<string, boolean>,
	outreachData: Record<string, number>
): Promise<{ active: MemberRecord[]; inactive: MemberRecord[] }> {
	const allDocs: AllDocs = await db.read('members', '_all_docs?include_docs=true');
	const now = Date.now();
	const active: MemberRecord[] = [];
	const inactive: MemberRecord[] = [];

	for (const row of allDocs?.rows ?? []) {
		const doc = row.doc ?? {};
		if (!doc || doc.isMember !== true) continue;

		const zip = row.id;
		const count = countsMap.get(zip) ?? 0;
		const name = doc.name ?? zip;
		const subTeam = doc.subTeam ?? '';
		const email = doc.demographics?.email ?? '';
		const updated = doc.demographics?.updated;
		const outreachCount = outreachData[zip] ?? 0;
		const duesPaid = duesMap.get(zip) ?? false;

		const record: MemberRecord = { zip, name, subTeam, email, count, duesPaid, outreachCount };

		if (isActiveMember(updated, now)) {
			active.push(record);
		} else {
			inactive.push(record);
		}
	}

	return { active, inactive };
}
