<script lang="ts">
	import AttendanceViewNav from '../../../../components/AttendanceViewNav.svelte';
	export let data: {
		props: {
			active: { zip: string; name: string; subTeam: string; email: string; count: number }[];
			inactive: { zip: string; name: string; subTeam: string; email: string; count: number }[];
			years?: string[];
			selectedYear?: string;
		};
	};

	const { active, inactive, years = [], selectedYear = '' } = data.props;

	let expanded: Record<string, { loading: boolean; dates: string[] | null }> = {};

	function onYearChange(e: Event) {
		const sel = e.currentTarget as HTMLSelectElement | null;
		sel?.form?.submit();
	}

	async function toggle(zip: string) {
		const state = expanded[zip];
		if (state && state.dates) {
			delete expanded[zip];
			expanded = { ...expanded };
			return;
		}
		expanded[zip] = { loading: true, dates: null };
		expanded = { ...expanded };
		try {
			const params = new URLSearchParams({ zip });
			if (selectedYear) params.set('year', selectedYear);
			const res = await fetch(`/attendance/view/attendance/dates?${params.toString()}`);
			if (!res.ok) throw new Error('Failed');
			const body: { dates: string[] } = await res.json();
			expanded[zip] = { loading: false, dates: body.dates ?? [] };
		} catch (e) {
			expanded[zip] = { loading: false, dates: [] };
		}
		expanded = { ...expanded };
	}
</script>

<div class="text-column">
	<AttendanceViewNav current="attendance" />

	<h1>Attendance by Member</h1>
	<form method="get" class="filter">
		<label for="year">Year</label>
		<select id="year" name="year" on:change={onYearChange}>
			<option value="" selected={!selectedYear}>All years</option>
			{#each years as y}
				<option value={y} selected={selectedYear === y}>{y}</option>
			{/each}
		</select>
	</form>
	<p class="muted">
		Click a member to view their attendance dates{selectedYear ? ` for ${selectedYear}` : ''}.
	</p>

	<section class="cards">
		<div class="card">
			<header>
				<h2>Active</h2>
				<span class="badge">{active.length}</span>
			</header>
			{#if active.length}
				<ul class="list">
					{#each active as m}
						<li class="member">
							<button
								type="button"
								class="row-button"
								aria-expanded={!!expanded[m.zip]}
								on:click={() => toggle(m.zip)}
							>
								<div class="info">
									<div class="name">{m.name}</div>
									<div class="meta">{m.subTeam}{m.subTeam && m.email ? ' • ' : ''}{m.email}</div>
								</div>
								<div class="count" title="Total check-ins">{m.count}</div>
							</button>
							{#if expanded[m.zip]}
								<div class="details">
									{#if expanded[m.zip]?.loading}
										<div class="loading">Loading…</div>
									{:else if (expanded[m.zip]?.dates?.length ?? 0) > 0}
										<ul class="dates">
											{#each expanded[m.zip]?.dates ?? [] as d}
												<li>{d}</li>
											{/each}
										</ul>
									{:else}
										<div class="muted">No dates found.</div>
									{/if}
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="muted">No active members with attendance.</p>
			{/if}
		</div>

		<div class="card">
			<header>
				<h2>Inactive</h2>
				<span class="badge">{inactive.length}</span>
			</header>
			{#if inactive.length}
				<ul class="list">
					{#each inactive as m}
						<li class="member">
							<button
								type="button"
								class="row-button"
								aria-expanded={!!expanded[m.zip]}
								on:click={() => toggle(m.zip)}
							>
								<div class="info">
									<div class="name">{m.name}</div>
									<div class="meta">{m.subTeam}{m.subTeam && m.email ? ' • ' : ''}{m.email}</div>
								</div>
								<div class="count" title="Total check-ins">{m.count}</div>
							</button>
							{#if expanded[m.zip]}
								<div class="details">
									{#if expanded[m.zip]?.loading}
										<div class="loading">Loading…</div>
									{:else if (expanded[m.zip]?.dates?.length ?? 0) > 0}
										<ul class="dates">
											{#each expanded[m.zip]?.dates ?? [] as d}
												<li>{d}</li>
											{/each}
										</ul>
									{:else}
										<div class="muted">No dates found.</div>
									{/if}
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="muted">No inactive members with attendance.</p>
			{/if}
		</div>
	</section>
</div>

<style>
	.text-column {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1rem;
	}
	.breadcrumbs {
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}
	.breadcrumbs a {
		text-decoration: none;
		color: inherit;
	}
	h1 {
		margin: 0.25rem 0 1rem;
	}
	.muted {
		color: #666;
	}

	.filter {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin: 0.25rem 0 1rem;
	}
	.filter select {
		border: 1px solid var(--light-bg-secondary);
		border-radius: 8px;
		padding: 0.35rem 0.5rem;
	}
	.cards {
		display: grid;
		gap: 1rem;
	}
	.card {
		background: #fff;
		border: 1px solid var(--light-bg-secondary);
		border-radius: 12px;
		padding: 1rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
	}
	.card header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.badge {
		background: #eef2ff;
		color: #3730a3;
		border: 1px solid #c7d2fe;
		border-radius: 999px;
		padding: 0.2rem 0.6rem;
		font-size: 0.85rem;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0.25rem 0 0;
	}
	.member {
		border-bottom: 1px dashed #eee;
		cursor: pointer;
	}
	.member:last-child {
		border-bottom: none;
	}
	.row-button {
		all: unset;
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.5rem 0.35rem;
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
	.count {
		min-width: 2.25rem;
		text-align: center;
		font-weight: 800;
	}
	.details {
		padding: 0.35rem 0.5rem 0.7rem;
	}
	.dates {
		list-style: disc;
		margin: 0.25rem 0 0 1.25rem;
		columns: 2;
		column-gap: 1.25rem;
	}
	.dates li {
		break-inside: avoid;
		-webkit-column-break-inside: avoid;
		margin-bottom: 0.25rem;
	}
	@media (min-width: 1100px) {
		.dates {
			columns: 3;
		}
	}
	.loading {
		color: #6b7280;
	}
	.member:hover {
		background: #fafafa;
	}
	.member:active {
		background: #f5f5f5;
	}
	.member .count {
		background: #f3f4f6;
		border-radius: 999px;
		padding: 0.15rem 0.5rem;
	}
	.member:hover .count {
		background: #e5e7eb;
	}
	.member:active .count {
		background: #d1d5db;
	}
	/* Dark mode overrides */
	:global(body.dark) .muted {
		color: var(--dark-txt-secondary);
	}
	:global(body.dark) .filter select {
		background: var(--dark-bg-primary);
		border-color: var(--dark-bg-secondary);
		color: var(--dark-txt-primary);
	}
	:global(body.dark) .card {
		background: var(--dark-bg-tertiary);
		border-color: var(--dark-bg-tertiary);
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.35),
			0 2px 10px rgba(0, 0, 0, 0.25);
	}
	:global(body.dark) .member {
		border-bottom: 1px dashed #2e3a59;
	}
	:global(body.dark) .member:hover {
		background: var(--dark-bg-secondary);
	}
	:global(body.dark) .member:active {
		background: #1f2937;
	}
	:global(body.dark) .member .count {
		background: var(--dark-bg-secondary);
		color: var(--dark-txt-primary);
	}
	:global(body.dark) .member:hover .count {
		background: #2e3a59;
	}
</style>
