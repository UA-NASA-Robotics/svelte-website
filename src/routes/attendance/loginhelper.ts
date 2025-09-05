import { Database } from "../../components/Database";


export async function createLoginDoc(db: Database, zip: string) {
    const success = await db.append('attendance', { zip: zip, timestamp: new Date().toISOString(), datestring: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }) });
    return success.ok;
}