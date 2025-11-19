import type { Database } from '../../../../components/Database';

export type MemberRecord = {
	zip: string;
	name: string;
	subTeam: string;
	email: string;
	count: number;
	duesPaid: boolean;
	outreachCount: number;
};

export type MemberDoc = {
	_id?: string;
	name?: string;
	isMember?: boolean;
	subTeam?: string;
	demographics?: { email?: string; updated?: number };
};

const ONE_YEAR_MS = 31536000000;

// School year logic: June (6) onwards rounds up to next calendar year value
export function schoolYearFromDate(d: Date): number {
	const yr = d.getFullYear();
	const m = d.getMonth() + 1; // 1-12
	return m >= 6 ? yr + 1 : yr;
}

export function getCurrentSchoolYear(): number {
	return schoolYearFromDate(new Date());
}

export function matchesSchoolYear(dateStr: string, schoolYear: string): boolean {
	const sy = Number(schoolYear);
	if (!sy) return false;
	const s = String(dateStr || '').trim();
	if (!s) return false;
	// Parse with Date first
	const d = new Date(s);
	if (!isNaN(d.getTime())) return schoolYearFromDate(d) === sy;
	// Fallback: try to extract MM and YYYY from common formats
	// Examples: 9/9/2025, 09-09-2025, 2025-09-09
	// Prefer a month-first pattern
	const mdY = s.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/);
	if (mdY) {
		const month = Number(mdY[1]);
		const year = Number(mdY[3]);
		const calc = month >= 6 ? year + 1 : year;
		return calc === sy;
	}
	// ISO leading year; assume Jan–Jul stay same year, Aug–Dec roll
	const yOnly = s.match(/\b(\d{4})\b/);
	if (yOnly) {
		const year = Number(yOnly[1]);
		// Without a month we can't be precise; assume matches if either direct or previous-year-to-next roll
		return year === sy || year + 1 === sy;
	}
	return false;
}

export function isActiveMember(updated: number | undefined, now: number): boolean {
	return typeof updated === 'number' && now - updated <= ONE_YEAR_MS;
}

export function sortMembers(a: MemberRecord, b: MemberRecord): number {
	return b.count - a.count || a.name.localeCompare(b.name);
}
