import type { Database } from '../../../../components/Database';

/**
 * Get dues payment status for members in a specific year
 * Returns a Map of zip -> boolean (true if dues paid)
 */
export async function getDuesStatus(
	db: Database,
	selectedYear: string | null
): Promise<Map<string, boolean>> {
	const paidMap = new Map<string, boolean>();

	if (selectedYear) {
		const yearNum = Number(selectedYear);
		// Query for specific year - view keys are [year, zip]
		const start = encodeURIComponent(`[${yearNum}]`);
		const end = encodeURIComponent(`[${yearNum + 1}]`);
		const viewPath = `_design/stats/_view/dues_by_zip_year?group_level=2&startkey=${start}&endkey=${end}`;
		const duesRows: { rows?: Array<{ key: [number, string]; value: number }> } | null =
			await db.read('dues', viewPath);
		for (const r of duesRows?.rows ?? []) {
			if (Array.isArray(r.key) && r.key.length >= 2) {
				const [year, zip] = r.key;
				// Verify year matches (should be within range)
				if (zip && year === yearNum) {
					paidMap.set(String(zip), (Number(r.value) || 0) > 0);
				}
			}
		}
	} else {
		// No specific year selected: mark paid if any dues exist across years
		const duesRows: { rows?: Array<{ key: string; value: number }> } | null = await db.read(
			'dues',
			'_design/stats/_view/dues_by_zip_year?group_level=1'
		);
		for (const r of duesRows?.rows ?? []) {
			if (r.key) paidMap.set(String(r.key), (Number(r.value) || 0) > 0);
		}
	}

	return paidMap;
}
