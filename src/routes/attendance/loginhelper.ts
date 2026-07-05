import { Database } from "../../components/Database";
import { needsCurrentSchoolYearDemographics } from './schoolYear';


export async function createLoginDoc(db: Database, zip: string) {
    const success = await db.append('attendance', { zip: zip, timestamp: new Date().toISOString(), datestring: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) });
    return success.ok;
}

// Returns true if member is missing demographics, lacks a current-school-year update, or any required field is blank
export function needsDemographics(member: any): boolean {
    if (!member || typeof member !== 'object') return true;
    const d = (member as any).demographics;
    if (!d) return true;
    const updated = d.updated;
    if (needsCurrentSchoolYearDemographics(updated)) return true;

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