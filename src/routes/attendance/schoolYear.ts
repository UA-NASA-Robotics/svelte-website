export function schoolYearFromDate(date: Date): number {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	return month >= 6 ? year + 1 : year;
}

export function getCurrentSchoolYear(now: Date = new Date()): number {
	return schoolYearFromDate(now);
}

export function schoolYearFromTimestamp(timestamp: number): number | undefined {
	if (!Number.isFinite(timestamp)) return undefined;
	const date = new Date(timestamp);
	if (Number.isNaN(date.getTime())) return undefined;
	return schoolYearFromDate(date);
}

export function isCurrentSchoolYearTimestamp(timestamp: number | undefined, now: number = Date.now()): boolean {
	if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) return false;
	const updatedSchoolYear = schoolYearFromTimestamp(timestamp);
	if (updatedSchoolYear === undefined) return false;

	const currentDate = new Date(now);
	if (Number.isNaN(currentDate.getTime())) return false;
	return updatedSchoolYear === schoolYearFromDate(currentDate);
}

export function needsCurrentSchoolYearDemographics(timestamp: number | undefined, now: number = Date.now()): boolean {
	return !isCurrentSchoolYearTimestamp(timestamp, now);
}