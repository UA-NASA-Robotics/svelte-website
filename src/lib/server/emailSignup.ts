import { Database } from '../../components/Database';

const DB_HOST = 'leboeuflasing.com:5984';
const DB_USER = 'contact';
const DB_PASSWORD = 'lunaboticswebsitecontact';

export const EMAIL_SIGNUP_DOC_ID = 'emailSignup';
export const EMAIL_SIGNUP_MAJOR_VIEW = '_design/stats/_view/major_options?group=true';
export const EMAIL_ARCHIVE_TABLE = 'email_archive';

const IGNORED_MAJORS = new Set(['prefer not to say', 'unknown', 'na', 'n/a']);

type EmailSignupConfigDoc = {
	_id?: string;
	_rev?: string;
	enabled?: boolean;
	updatedAt?: string;
	[key: string]: unknown;
};

type EmailSignupDoc = {
	_id?: string;
	name?: string;
	email?: string;
	major?: string;
	source?: string;
	createdAt?: string;
};

type EmailArchiveDoc = {
	_id?: string;
	_rev?: string;
	archivedAt?: string;
	recordCount?: number;
	records?: EmailSignupDoc[];
};

type AllDocsResult = {
	rows?: Array<{ id: string; doc?: EmailSignupDoc | EmailArchiveDoc }>;
} | null;

type ViewResult = {
	rows?: Array<{ key?: unknown; value?: unknown }>;
} | null;

export type EmailSignupRecord = {
	id: string;
	name: string;
	email: string;
	major: string;
	source: string;
	createdAt: string;
};

export type EmailArchiveRecord = {
	id: string;
	archivedAt: string;
	recordCount: number;
	records: EmailSignupRecord[];
	copyText: string;
};

export function createClubDatabase() {
	return new Database(DB_HOST, DB_USER, DB_PASSWORD);
}

export function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}

export function isUakronEmail(email: string) {
	return /^[^@\s]+@uakron\.edu$/i.test(email.trim());
}

export function normalizeMajor(selectedMajor: string, customMajor: string) {
	const custom = customMajor.trim();
	if (custom) return custom;

	const selected = selectedMajor.trim();
	if (!selected || selected === '__custom__') return '';
	return selected;
}

export function parseBulkEmailInput(input: string) {
	const tokens = input
		.split(/[\n,;]+/)
		.map((value) => value.trim())
		.filter(Boolean);

	const valid: string[] = [];
	const invalid: string[] = [];

	for (const token of tokens) {
		if (isUakronEmail(token)) {
			valid.push(normalizeEmail(token));
		} else {
			invalid.push(token);
		}
	}

	return { valid, invalid };
}

export function formatMailingListForOutlook(
	records: Array<Pick<EmailSignupRecord, 'name' | 'email'>>
) {
	return records
		.map((record) => {
			const name = record.name.trim().replace(/[<>\"]/g, '').replace(/\s+/g, ' ');
			return name ? `${name} <${record.email}>` : record.email;
		})
		.join('; ');
}

export async function readEmailSignupStatus() {
	const doc = (await createClubDatabase().read(
		'keys',
		EMAIL_SIGNUP_DOC_ID
	)) as EmailSignupConfigDoc | null;

	return {
		enabled: doc?.enabled === true
	};
}

export async function updateEmailSignupStatus(enabled: boolean) {
	const db = createClubDatabase();
	const existing = (await db.read('keys', EMAIL_SIGNUP_DOC_ID)) as EmailSignupConfigDoc | null;
	const payload = {
		...(existing && typeof existing === 'object' ? existing : {}),
		enabled,
		updatedAt: new Date().toISOString()
	};

	return db.update('keys', EMAIL_SIGNUP_DOC_ID, payload);
}

export async function loadMajorOptions() {
	const result = (await createClubDatabase().read('members', EMAIL_SIGNUP_MAJOR_VIEW)) as ViewResult;
	const options = new Set<string>();

	for (const row of result?.rows ?? []) {
		if (typeof row.key !== 'string') continue;
		const major = row.key.trim();
		if (!major) continue;
		if (IGNORED_MAJORS.has(major.toLowerCase())) continue;
		options.add(major);
	}

	return Array.from(options).sort((left, right) => left.localeCompare(right));
}

export async function loadEmailSignupRecords() {
	const result = (await createClubDatabase().read(
		'email',
		'_all_docs?include_docs=true'
	)) as AllDocsResult;

	return (result?.rows ?? [])
		.filter((row) => row.id && !row.id.startsWith('_design'))
		.map((row) => {
			const doc = (row.doc ?? {}) as EmailSignupDoc;
			return {
				id: row.id,
				name: (doc.name ?? '').trim(),
				email: normalizeEmail(doc.email ?? ''),
				major: (doc.major ?? '').trim(),
				source: (doc.source ?? 'public').trim() || 'public',
				createdAt: (doc.createdAt ?? '').trim()
			};
		})
		.filter((record) => record.email)
		.sort((left, right) => {
			const leftName = left.name || left.email;
			const rightName = right.name || right.email;
			return leftName.localeCompare(rightName, undefined, { sensitivity: 'base' });
		});
}

	function normalizeEmailSignupRecord(doc: EmailSignupDoc, id: string): EmailSignupRecord {
		return {
			id,
			name: (doc.name ?? '').trim(),
			email: normalizeEmail(doc.email ?? ''),
			major: (doc.major ?? '').trim(),
			source: (doc.source ?? 'public').trim() || 'public',
			createdAt: (doc.createdAt ?? '').trim()
		};
	}

	function sortEmailSignupRecords(records: EmailSignupRecord[]) {
		return records.sort((left, right) => {
			const leftName = left.name || left.email;
			const rightName = right.name || right.email;
			return leftName.localeCompare(rightName, undefined, { sensitivity: 'base' });
		});
	}

	export async function loadEmailArchives() {
		const result = (await createClubDatabase().read(
			EMAIL_ARCHIVE_TABLE,
			'_all_docs?include_docs=true'
		)) as AllDocsResult;

		return (result?.rows ?? [])
			.filter((row) => row.id && !row.id.startsWith('_design'))
			.map((row) => {
				const doc = (row.doc ?? {}) as EmailArchiveDoc;
				const records = sortEmailSignupRecords(
					(doc.records ?? [])
						.map((record) => normalizeEmailSignupRecord(record, ''))
						.filter((record) => record.email)
				);

				return {
					id: row.id,
					archivedAt: (doc.archivedAt ?? '').trim(),
					recordCount: records.length,
					records,
					copyText: formatMailingListForOutlook(records)
				};
			})
			.sort((left, right) => right.archivedAt.localeCompare(left.archivedAt));
	}

	export async function archiveEmailSignupRecords(records: EmailSignupRecord[]) {
		const result = await createClubDatabase().append(EMAIL_ARCHIVE_TABLE, {
			archivedAt: new Date().toISOString(),
			recordCount: records.length,
			records: records.map(({ id, ...record }) => record)
		});

		if (!result || !('ok' in result) || !result.ok || typeof result.id !== 'string') {
			return null;
		}

		return result.id;
	}

	export async function deleteEmailSignupRecords(records: EmailSignupRecord[]) {
		const results = await Promise.all(
			records.map((record) => createClubDatabase().delete('email', record.id))
		);
		return results.filter((result) => result && 'ok' in result && result.ok).length;
	}

	export async function deleteEmailArchive(id: string) {
		return createClubDatabase().delete(EMAIL_ARCHIVE_TABLE, id);
	}

	export async function restoreEmailArchive(archive: EmailArchiveRecord) {
		const results = await Promise.all(
			archive.records.map(({ id, ...record }) => createClubDatabase().append('email', record))
		);
		return results.filter((result) => result && 'ok' in result && result.ok).length;
	}