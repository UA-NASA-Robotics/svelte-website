<script lang="ts">
	import AttendanceViewNav from '../../../../components/AttendanceViewNav.svelte';

	type EmailRecord = {
		id: string;
		name: string;
		email: string;
		major: string;
		source: string;
		createdAt: string;
	};

	export let data: {
		props: {
			enabled: boolean;
			records: EmailRecord[];
			copyAllText: string;
		};
	};

	export let form: {
		success?: boolean;
		message?: string;
		error?: string;
		invalidEmails?: string[];
		bulkValue?: string;
	} | null = null;

	const { enabled, records, copyAllText } = data.props;
	let copyFeedback = '';
	let bulkValue = form?.bulkValue ?? '';

	function formatCreatedAt(timestamp: string) {
		if (!timestamp) return 'Unknown';
		const date = new Date(timestamp);
		if (Number.isNaN(date.getTime())) return timestamp;
		return date.toLocaleString();
	}

	async function copyAll() {
		if (!copyAllText) return;

		try {
			await navigator.clipboard.writeText(copyAllText);
			copyFeedback = 'Copied mailing list to the clipboard.';
		} catch {
			copyFeedback = 'Clipboard access failed. Select the export text manually.';
		}
	}

	function confirmDelete(email: string) {
		return window.confirm(`Remove ${email} from the mailing list?`);
	}
</script>

<div class="text-column">
	<AttendanceViewNav current="email-list" />

	<h1>Email Signup Management</h1>
	<p class="muted">
		Control the public signup form, manage the mailing list, and prepare Outlook-ready exports.
	</p>

	{#if form?.message}
		<div
			class:notice-success={form.success}
			class:notice-error={!form.success}
			class="notice"
			role="status"
		>
			{form.message}
		</div>
	{:else if form?.error}
		<div class="notice notice-error" role="alert">{form.error}</div>
	{/if}

	<div class="overview-grid">
		<section class="card status-card">
			<div>
				<p class="label">Public signup</p>
				<p class:enabled class:disabled={!enabled} class="status-text">
					{enabled ? 'Enabled' : 'Disabled'}
				</p>
			</div>
			<form method="POST" action="?/toggle">
				<input type="hidden" name="enabled" value={enabled ? 'false' : 'true'} />
				<button type="submit" class={enabled ? 'danger' : 'primary'}>
					{enabled ? 'Disable Signup' : 'Enable Signup'}
				</button>
			</form>
		</section>

		<section class="card summary-card">
			<p class="label">Stored emails</p>
			<p class="count">{records.length}</p>
			<p class="muted">Records are stored in the CouchDB email table.</p>
		</section>
	</div>

	<section class="card export-card">
		<div class="section-head">
			<div>
				<h2>Copy All for Outlook</h2>
				<p class="muted">
					Semicolon-separated entries using Name &lt;email&gt; when a name exists.
				</p>
			</div>
			<button type="button" class="primary" on:click={copyAll} disabled={!copyAllText}
				>Copy All</button
			>
		</div>
		<textarea readonly rows="4">{copyAllText}</textarea>
		{#if copyFeedback}
			<p class="copy-feedback">{copyFeedback}</p>
		{/if}
	</section>

	<section class="card bulk-card">
		<h2>Bulk Add Emails</h2>
		<p class="muted">
			Paste emails separated by commas, semicolons, or new lines. Only @uakron.edu addresses are
			accepted.
		</p>
		<form method="POST" action="?/bulk_add">
			<label for="emails" class="sr-only">Emails</label>
			<textarea
				id="emails"
				name="emails"
				rows="6"
				bind:value={bulkValue}
				placeholder="abc123@uakron.edu, def456@uakron.edu"
			></textarea>
			<div class="actions">
				<button type="submit" class="primary">Add Emails</button>
			</div>
		</form>
		{#if form?.invalidEmails && form.invalidEmails.length}
			<div class="invalid-list" role="status">
				<p class="label">Skipped invalid entries</p>
				<p>{form.invalidEmails.join(', ')}</p>
			</div>
		{/if}
	</section>

	<section class="card table-card">
		<div class="section-head">
			<div>
				<h2>Mailing List</h2>
				<p class="muted">Delete any row to remove it from the database.</p>
			</div>
		</div>

		{#if records.length}
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Major</th>
							<th>Source</th>
							<th>Created</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each records as record}
							<tr>
								<td>{record.name || '—'}</td>
								<td><a href={`mailto:${record.email}`}>{record.email}</a></td>
								<td>{record.major || '—'}</td>
								<td>{record.source}</td>
								<td>{formatCreatedAt(record.createdAt)}</td>
								<td>
									<form
										method="POST"
										action="?/delete"
										on:submit={(event) => {
											if (!confirmDelete(record.email)) {
												event.preventDefault();
											}
										}}
									>
										<input type="hidden" name="id" value={record.id} />
										<button type="submit" class="danger">Remove</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p class="muted">No emails have been collected yet.</p>
		{/if}
	</section>
</div>

<style>
	.text-column {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}

	h1 {
		margin: 0.25rem 0 0.5rem;
	}

	h2 {
		margin: 0;
		font-size: 1.15rem;
	}

	.muted {
		color: #666;
	}

	.notice {
		padding: 0.75rem 1rem;
		border-radius: 10px;
		margin: 0 0 1rem;
		font-weight: 600;
	}

	.notice-success {
		background: #e6f8ec;
		border: 1px solid #8ed0a5;
		color: #14532d;
	}

	.notice-error {
		background: #fdecec;
		border: 1px solid #f1b1b1;
		color: #7a1f1f;
	}

	.overview-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.card {
		background: #fff;
		border: 1px solid var(--light-bg-secondary);
		border-radius: 16px;
		padding: 1.2rem;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
		margin-bottom: 1rem;
	}

	.status-card,
	.summary-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.label {
		margin: 0 0 0.35rem;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 700;
		color: #6b7280;
	}

	.status-text,
	.count {
		margin: 0;
		font-size: 1.7rem;
		font-weight: 800;
	}

	.enabled {
		color: #166534;
	}

	.disabled {
		color: #991b1b;
	}

	.section-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.9rem;
	}

	textarea {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid var(--light-bg-secondary);
		border-radius: 12px;
		padding: 0.8rem 0.9rem;
		font: inherit;
		resize: vertical;
		background: #fff;
		color: var(--light-txt-primary);
	}

	textarea:focus {
		outline: none;
		border-color: var(--ua-blue);
		box-shadow: 0 0 0 4px rgba(0, 76, 157, 0.14);
	}

	.actions {
		margin-top: 0.75rem;
		display: flex;
		justify-content: flex-end;
	}

	button {
		border: none;
		border-radius: 999px;
		padding: 0.7rem 1rem;
		font-weight: 700;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.primary {
		background: var(--ua-blue);
		color: #fff;
	}

	.primary:hover:enabled {
		background: var(--ua-dark-blue);
	}

	.danger {
		background: #991b1b;
		color: #fff;
	}

	.danger:hover {
		background: #7f1d1d;
	}

	.copy-feedback {
		margin: 0.6rem 0 0;
		font-size: 0.95rem;
		color: #065f46;
	}

	.invalid-list {
		margin-top: 0.9rem;
		padding: 0.9rem 1rem;
		background: #fff7ed;
		border: 1px solid #fdba74;
		border-radius: 12px;
		color: #9a3412;
	}

	.table-wrap {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		padding: 0.8rem 0.7rem;
		border-bottom: 1px solid #e5e7eb;
		text-align: left;
		vertical-align: top;
	}

	th {
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #6b7280;
	}

	tbody tr:hover {
		background: #f9fafb;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	:global(body.dark) .muted,
	:global(body.dark) .label,
	:global(body.dark) th {
		color: var(--dark-txt-secondary);
	}

	:global(body.dark) .card {
		background: var(--dark-bg-tertiary);
		border-color: var(--dark-bg-secondary);
	}

	:global(body.dark) textarea {
		background: var(--dark-bg-primary);
		border-color: var(--dark-bg-secondary);
		color: var(--dark-txt-primary);
	}

	:global(body.dark) tbody tr:hover {
		background: var(--dark-bg-secondary);
	}

	:global(body.dark) td {
		border-bottom-color: #2e3a59;
	}

	:global(body.dark) .notice-success {
		background: rgba(20, 83, 45, 0.45);
		border-color: rgba(74, 222, 128, 0.55);
		color: #d1fae5;
	}

	:global(body.dark) .notice-error {
		background: rgba(127, 29, 29, 0.45);
		border-color: rgba(248, 113, 113, 0.55);
		color: #fecaca;
	}

	:global(body.dark) .invalid-list {
		background: rgba(154, 52, 18, 0.25);
		border-color: rgba(251, 146, 60, 0.55);
		color: #fed7aa;
	}

	@media (max-width: 800px) {
		.overview-grid {
			grid-template-columns: 1fr;
		}

		.status-card,
		.summary-card,
		.section-head {
			flex-direction: column;
			align-items: flex-start;
		}

		.actions {
			justify-content: flex-start;
		}
	}
</style>
