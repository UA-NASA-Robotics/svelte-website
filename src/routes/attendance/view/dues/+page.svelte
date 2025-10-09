<script lang="ts">
	import AttendanceViewNav from '../../../../components/AttendanceViewNav.svelte';
	export let data: {
		props: {
			members: { zip: string; name: string; subTeam: string }[];
			years?: string[];
			selectedYear: string;
			paid: Record<
				string,
				{ method: string; id?: string; timestamp?: string; datestring?: string }
			>;
		};
	};
	const { members, years = [], selectedYear, paid } = data.props;

	let filter = '';
	$: filtered = members.filter((m) =>
		[m.name, m.zip, m.subTeam].join(' ').toLowerCase().includes(filter.toLowerCase())
	);

	let expanded: Record<string, boolean> = {};

	function onYearChange(e: Event) {
		const sel = e.currentTarget as HTMLSelectElement | null;
		sel?.form?.submit();
	}

	function confirmDelete(id: string): boolean {
		return window.confirm(
			'Are you sure you want to remove this dues record? This action cannot be undone.'
		);
	}

	function onRowClick(e: MouseEvent, zip: string) {
		const target = e.target as HTMLElement | null;
		if (!target) return;
		// Don't toggle when clicking on forms/inputs/buttons
		if (
			target.closest('form') ||
			target.closest('button') ||
			target.closest('select') ||
			target.closest('a') ||
			target.closest('input')
		)
			return;
		expanded[zip] = !expanded[zip];
	}
</script>

<div class="text-column">
	<AttendanceViewNav current="dues" />
	<h1>Membership Dues</h1>
	<p class="muted">Annual dues are $15 per member. Mark payments and their method.</p>

	<form method="get" class="controls">
		<label for="year">Year</label>
		<select id="year" name="year" on:change={onYearChange}>
			{#each years as y}
				<option value={y} selected={selectedYear === y}>{y}</option>
			{/each}
			{#if !years.includes(selectedYear)}
				<option value={selectedYear} selected>{selectedYear}</option>
			{/if}
		</select>
		<input type="search" placeholder="Filter by name, zip, subteam…" bind:value={filter} />
	</form>

	<section class="cards">
		<ul class="members">
			{#each filtered as m}
				<li class:paid={paid[m.zip]}>
					{#if paid[m.zip]}
						<button
							type="button"
							class="row"
							on:click={() => (expanded[m.zip] = !expanded[m.zip])}
							aria-expanded={!!expanded[m.zip]}
						>
							<div class="info">
								<div class="name">{m.name}</div>
								<div class="meta">{m.subTeam} {m.subTeam ? '•' : ''} {m.zip}</div>
							</div>
							<span class="status">Paid ({paid[m.zip].method})</span>
						</button>
					{:else}
						<div class="row">
							<div class="info">
								<div class="name">{m.name}</div>
								<div class="meta">{m.subTeam} {m.subTeam ? '•' : ''} {m.zip}</div>
							</div>
							<form method="POST" class="mark">
								<input type="hidden" name="zip" value={m.zip} />
								<select name="method">
									<option value="cash">Cash</option>
									<option value="online">Online</option>
									<option value="other">Other</option>
								</select>
								<input type="hidden" name="timezone" value="America/Chicago" />
								<button type="submit" formaction="?/mark" class="primary">Mark Paid</button>
							</form>
						</div>
					{/if}
				</li>
				{#if paid[m.zip] && expanded[m.zip]}
					<li class="detail">
						<div class="detail-row">
							<div>
								<div class="muted">Date paid</div>
								<div>{paid[m.zip].datestring ?? paid[m.zip].timestamp ?? '(unknown)'}</div>
							</div>
							{#if paid[m.zip].id}
								<form
									method="POST"
									class="delete"
									on:submit={(e) => {
										if (!confirmDelete(paid[m.zip].id!)) {
											e.preventDefault();
										}
									}}
								>
									<input type="hidden" name="id" value={paid[m.zip].id} />
									<button type="submit" formaction="?/delete" class="danger">Remove</button>
								</form>
							{/if}
						</div>
					</li>
				{/if}
			{/each}
		</ul>
	</section>
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
	.controls {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin: 0.5rem 0 1rem;
	}
	.controls select {
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 0.35rem 0.5rem;
	}
	.members {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 0.5rem;
	}
	.members li {
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 0.6rem 0.7rem;
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		align-items: center;
	}
	.row {
		all: unset;
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		align-items: center;
		width: 100%;
		cursor: pointer;
	}
	.name {
		font-weight: 700;
	}
	.meta {
		color: #6b7280;
		font-size: 0.9rem;
	}
	.status {
		font-weight: 700;
		color: #065f46;
		background: #ecfdf5;
		border: 1px solid #a7f3d0;
		border-radius: 999px;
		padding: 0.2rem 0.5rem;
		cursor: pointer;
	}
	form.mark {
		display: inline-flex;
		gap: 0.4rem;
		align-items: center;
	}
	button.primary {
		background: #111827;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.45rem 0.7rem;
	}
	button.primary:hover {
		background: #374151;
	}
	.paid {
		background: #f9fafb;
	}
	.detail {
		border: 1px dashed #e5e7eb;
		border-radius: 12px;
		padding: 0.6rem 0.7rem;
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		align-items: center;
	}
	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}
	form.delete {
		margin-left: auto;
	}
	button.danger {
		background: #991b1b;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.45rem 0.7rem;
	}
	button.danger:hover {
		background: #7f1d1d;
	}
	:global(body.dark) .members li {
		border-color: var(--dark-bg-secondary);
	}
	:global(body.dark) .detail {
		border-color: var(--dark-bg-secondary);
	}
</style>
