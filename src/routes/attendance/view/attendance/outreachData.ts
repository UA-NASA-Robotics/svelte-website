import type { Database } from '../../../../components/Database';

/**
 * Get outreach attendance counts for members in a specific year
 * Returns a Map of zip -> outreach count
 */
export async function getOutreachCounts(
	db: Database,
	selectedYear: number
): Promise<Record<string, number>> {
	try {
		const docId = `${selectedYear}outreachCache`;
		const outreachCache = await db.read('keys', docId);
		
		// Check if cache exists and has data
		if (outreachCache && outreachCache.data) {
			return outreachCache.data as Record<string, number>;
		}
		
		// If no cache, return empty
		return {};
	} catch {
		return {};
	}
}
