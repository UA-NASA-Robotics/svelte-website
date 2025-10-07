<script lang="ts">
	import AttendanceViewNav from '../../../../../components/AttendanceViewNav.svelte';
	export let data: { props: { members: { zip: string; name: string; subTeam: string }[] } };
	export let form: { success?: boolean; message?: string; okCount?: number; total?: number } | null;
	const members = data.props.members;

	let filter = '';
	let selected = new Set<string>();
	let date = '';
	let time = '';
	let timezone = 'America/Chicago';

	function toggle(zip: string) {
		if (selected.has(zip)) selected.delete(zip);
		else selected.add(zip);
		selected = new Set(selected);
	}

	function selectAll(list: { zip: string }[]) {
		for (const m of list) selected.add(m.zip);
		selected = new Set(selected);
	}
	function clearAll() {
		selected = new Set();
	}

	$: filtered = members.filter((m) =>
		[m.name, m.zip, m.subTeam].join(' ').toLowerCase().includes(filter.toLowerCase())
	);
</script>

<div class="text-column">
	<AttendanceViewNav current="manual" />
	<h1>Manual Attendance Entry</h1>
	<p class="muted">
		Select a date/time and choose one or more members to add attendance records for that date. Each
		selected member will receive its own record.
	</p>
	{#if form}
		<div class:notice-success={form.success} class:notice-error={!form.success} class="notice">
			{form.message}
			{#if form.okCount != null && form.total != null}
				<span class="muted">({form.okCount}/{form.total})</span>
			{/if}
		</div>
	{/if}

	<form method="POST">
		<fieldset class="when">
			<legend>Date and time</legend>
			<label>
				<span>Date</span>
				<input type="date" name="date" bind:value={date} required />
			</label>
			<label>
				<span>Time</span>
				<input type="time" name="time" bind:value={time} />
			</label>
			<label>
				<span>Timezone</span>
				<select name="timezone" bind:value={timezone}>
					<option>America/Chicago</option>
					<option>America/New_York</option>
					<option>America/Denver</option>
					<option>America/Los_Angeles</option>
				</select>
			</label>
		</fieldset>

		<fieldset class="who">
			<legend>Members</legend>
			<div class="toolbar">
				<input type="search" placeholder="Filter by name, zip, or subteam…" bind:value={filter} />
				<div class="spacer"></div>
				<button type="button" on:click={() => selectAll(filtered)}>Select all</button>
				<button type="button" on:click={clearAll}>Clear</button>
			</div>
			<ul class="members">
				{#each filtered as m}
					<li>
						<label>
							<input
								type="checkbox"
								name="zip"
								value={m.zip}
								checked={selected.has(m.zip)}
								on:change={() => toggle(m.zip)}
							/>
							<span class="name">{m.name}</span>
							<span class="meta">{m.subTeam}</span>
						</label>
					</li>
				{/each}
			</ul>
		</fieldset>

		<div class="actions">
			<button type="submit" formaction="?/create" class="primary">Add records</button>
		</div>
	</form>
</div>

<style>
	.text-column {
		max-width: 1100px;
		margin: 0 auto;
		padding: 1rem;
	}
	.muted {
		color: #666;
	}
	fieldset {
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 1rem;
		margin-bottom: 1rem;
	}
	legend {
		font-weight: 700;
		padding: 0 0.25rem;
	}
	.when label {
		display: grid;
		gap: 0.25rem;
		margin-right: 1rem;
	}
	.when {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.who .toolbar {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.who .toolbar .spacer {
		flex: 1;
	}
	.members {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 0.35rem;
	}
	.members li {
		border: 1px solid #eee;
		border-radius: 10px;
		padding: 0.4rem 0.5rem;
	}
	.members label {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	.name {
		font-weight: 600;
	}
	.meta {
		color: #6b7280;
		font-size: 0.9rem;
		margin-left: auto;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.75rem;
	}
	button.primary {
		background: #111827;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.55rem 0.8rem;
	}
	button.primary:hover {
		background: #374151;
	}
	.notice {
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		padding: 0.6rem 0.8rem;
		margin: 0.5rem 0 0.75rem;
	}
	.notice-success {
		background: #ecfdf5;
		border-color: #a7f3d0;
		color: #065f46;
	}
	.notice-error {
		background: #fef2f2;
		border-color: #fecaca;
		color: #7f1d1d;
	}

	:global(body.dark) fieldset {
		border-color: var(--dark-bg-secondary);
	}
	:global(body.dark) .members li {
		border-color: var(--dark-bg-secondary);
	}
</style>
