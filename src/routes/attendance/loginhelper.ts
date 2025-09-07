import { Database } from "../../components/Database";


export async function createLoginDoc(db: Database, zip: string) {
    const success = await db.append('attendance', { zip: zip, timestamp: new Date().toISOString(), datestring: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) });
    return success.ok;
}

const ONE_YEAR_MS = 31536000000;

// Returns true if member is missing demographics, has stale info (>1 year), or any required field is blank
export function needsDemographics(member: any): boolean {
    if (!member || typeof member !== 'object') return true;
    const d = (member as any).demographics;
    if (!d) return true;
    const updated = d.updated;
    if (typeof updated !== 'number' || (Date.now() - updated > ONE_YEAR_MS)) return true;

    const missing = (v: unknown) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
    const yearsOk = !(d.yearsOnTeam === '' || d.yearsOnTeam === undefined || d.yearsOnTeam === null);
    if (missing(d.email)) return true;
    if (!yearsOk) return true;
    if (missing(d.gender)) return true;
    if (missing(d.major)) return true;
    if (missing(d.ethnicity)) return true;
    if (missing(d.isHispanic)) return true;
    return false;
}