<script lang="ts">
	import AttendanceViewNav from '../../../../components/AttendanceViewNav.svelte';
	import { onMount } from 'svelte';
	export let data: {
		props: {
			active: { id: string; name: string; email: string; subTeam: string }[];
			inactive: { id: string; name: string; email: string; subTeam: string }[];
		};
	};

	const { active, inactive } = data.props;

	type Member = { id: string; name: string; email: string; subTeam: string };
	type SortMode = 'name' | 'subteam';
	let sortMode: SortMode = 'name';
	const SORT_STORAGE_KEY = 'members_sort_mode';

	onMount(() => {
		try {
			const saved =
				typeof window !== 'undefined' ? window.localStorage.getItem(SORT_STORAGE_KEY) : null;
			if (saved === 'name' || saved === 'subteam') {
				sortMode = saved;
			}
		} catch {}
	});

	function normalizeTeam(s: string) {
		const v = (s || '').trim().toLowerCase();
		if (!v) return 'zzz';
		if (v.startsWith('mech')) return 'mechanical';
		if (v.startsWith('elec')) return 'electrical';
		if (v.startsWith('soft')) return 'software';
		if (v.includes('mgmt') || v.includes('manage') || v.includes('other')) return 'other';
		return v;
	}

	function byName(a: Member, b: Member) {
		return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
	}

	function bySubTeam(a: Member, b: Member) {
		const at = normalizeTeam(a.subTeam);
		const bt = normalizeTeam(b.subTeam);
		if (at !== bt) return at.localeCompare(bt);
		return byName(a, b);
	}

	$: sortedActive = [...active].sort(sortMode === 'subteam' ? bySubTeam : byName);
	$: sortedInactive = [...inactive].sort(sortMode === 'subteam' ? bySubTeam : byName);
	$: (() => {
		try {
			if (typeof window !== 'undefined') window.localStorage.setItem(SORT_STORAGE_KEY, sortMode);
		} catch {}
	})();
</script>

<div class="text-column">
	<AttendanceViewNav current="members" />

	<h1>Members by Activity</h1>
	<div class="controls">
		<label for="sort">Sort</label>
		<select id="sort" bind:value={sortMode}>
			<option value="name">By name (A–Z)</option>
			<option value="subteam">By sub-team (A–Z)</option>
		</select>
	</div>
	<p class="muted">Active = demographics confirmed within the last 12 months.</p>

	<section class="lists">
		<div class="card">
			<header>
				<h2>Active ({active.length})</h2>
			</header>
			{#if active.length}
				<table class="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Sub-team</th>
						</tr>
					</thead>
					<tbody>
						{#each sortedActive as m}
							<tr>
								<td>{m.name}</td>
								<td><a href={`mailto:${m.email}`}>{m.email}</a></td>
								<td>{m.subTeam}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<p class="muted">No active members.</p>
			{/if}
		</div>

		<div class="card">
			<header>
				<h2>Inactive ({inactive.length})</h2>
			</header>
			{#if inactive.length}
				<table class="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Sub-team</th>
						</tr>
					</thead>
					<tbody>
						{#each sortedInactive as m}
							<tr>
								<td>{m.name}</td>
								<td><a href={`mailto:${m.email}`}>{m.email}</a></td>
								<td>{m.subTeam}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<p class="muted">No inactive members.</p>
			{/if}
		</div>
	</section>
</div>

<style>
	.text-column {
		max-width: 1100px;
		margin: 0 auto;
		padding: 1rem;
	}
	h1 {
		margin: 0.25rem 0 1rem;
	}
	.muted {
		color: #666;
	}

	.lists {
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

	.table {
		width: 100%;
		border-collapse: collapse;
	}
	.table th,
	.table td {
		padding: 0.6rem;
		border-bottom: 1px solid #eee;
		text-align: left;
	}
	.table th {
		font-weight: 700;
		color: #374151;
	}
	.table tr:hover {
		background: #fafafa;
	}

	.controls {
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
		margin: 0 0 0.75rem;
	}
	.controls select {
		border: 1px solid var(--light-bg-secondary);
		border-radius: 8px;
		padding: 0.35rem 0.5rem;
	}
	:global(body.dark) .card {
		background: var(--dark-bg-tertiary);
		border-color: var(--dark-bg-tertiary);
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.35),
			0 2px 10px rgba(0, 0, 0, 0.25);
	}
	:global(body.dark) .table th {
		color: var(--dark-txt-primary);
	}
	:global(body.dark) .table td {
		color: var(--dark-txt-primary);
		border-bottom: 1px solid #2e3a59;
	}
	:global(body.dark) .table tr:hover {
		background: var(--dark-bg-secondary);
	}
	:global(body.dark) .controls select {
		background: var(--dark-bg-primary);
		border-color: var(--dark-bg-secondary);
		color: var(--dark-txt-primary);
	}
</style>
