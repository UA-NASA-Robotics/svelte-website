<script lang="ts">
	import AttendanceViewNav from '../../../components/AttendanceViewNav.svelte';
	export let data: {
		props: {
			gender: { key: string | number; value: number }[];
			major: { key: string | number; value: number }[];
			years: { key: string | number; value: number }[];
			ethnicity?: { key: string | number; value: number }[];
			isHispanic?: { key: string | number; value: number }[];
			numLatestYear?: number;
		};
	};

	const { gender, major, years, ethnicity = [], isHispanic = [], numLatestYear } = data.props;

	function total(rows: { value: number }[]) {
		return rows.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
	}

	function pct(value: number, rows: { value: number }[]) {
		const t = total(rows);
		if (!t) return '0.0';
		const v = Number(value) || 0;
		return ((v * 100) / t).toFixed(1);
	}
</script>

<div class="text-column">
	<AttendanceViewNav current="demographics" />

	<h1>Member Demographics Summary</h1>
	<p class="muted">Counts are aggregated from anonymized member demographics.</p>

	<section class="cards">
		<div class="card">
			<header>
				<h2>By Gender</h2>
				<span class="badge">Total: {total(gender)}</span>
			</header>
			{#if gender.length}
				<ul class="list">
					{#each gender as row}
						<li>
							<span class="k">{row.key || 'Unknown'}</span>
							<span class="v">{row.value} <span class="pct">({pct(row.value, gender)}%)</span></span
							>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="muted">No data.</p>
			{/if}
		</div>

		<div class="card">
			<header>
				<h2>By Major</h2>
				<span class="badge">Total: {total(major)}</span>
			</header>
			{#if major.length}
				<ul class="list">
					{#each major as row}
						<li>
							<span class="k">{row.key || 'Unknown'}</span>
							<span class="v">{row.value} <span class="pct">({pct(row.value, major)}%)</span></span>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="muted">No data.</p>
			{/if}
		</div>

		<div class="card">
			<header>
				<h2>By Years on Team</h2>
				<span class="badge">Total: {total(years)}</span>
			</header>
			{#if years.length}
				<ul class="list">
					{#each years as row}
						<li>
							<span class="k">{row.key || 'Unknown'}</span>
							<span class="v">{row.value} <span class="pct">({pct(row.value, years)}%)</span></span>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="muted">No data.</p>
			{/if}
		</div>

		<div class="card">
			<header>
				<h2>By Ethnicity</h2>
				<span class="badge">Total: {total(ethnicity)}</span>
			</header>
			{#if ethnicity.length}
				<ul class="list">
					{#each ethnicity as row}
						<li>
							<span class="k">{row.key || 'Prefer not to say'}</span>
							<span class="v"
								>{row.value} <span class="pct">({pct(row.value, ethnicity)}%)</span></span
							>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="muted">No data.</p>
			{/if}
		</div>

		<div class="card">
			<header>
				<h2>Hispanic/Latino</h2>
				<span class="badge">Total: {total(isHispanic)}</span>
			</header>
			{#if isHispanic.length}
				<ul class="list">
					{#each isHispanic as row}
						<li>
							<span class="k">{row.key || 'Prefer not to say'}</span>
							<span class="v"
								>{row.value} <span class="pct">({pct(row.value, isHispanic)}%)</span></span
							>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="muted">No data.</p>
			{/if}
		</div>
	</section>
	{#if typeof numLatestYear === 'number'}
		<p>
			Demographic data for the {numLatestYear - 1} - {numLatestYear} school year.
		</p>
	{/if}
</div>

<style>
	.text-column {
		max-width: 75vw;
		margin: 0 auto;
		padding: 1rem;
	}
	h1 {
		margin: 0.25rem 0 1rem;
	}
	.muted {
		color: #666;
	}

	.cards {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
	}
	@media (min-width: 720px) {
		.cards {
			grid-template-columns: 1fr 1fr;
		}
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

	.card header h2 {
		margin-right: 0.5rem;
	}

	.k {
		margin-right: 0.5rem;
	}
	.badge {
		background: #eef2ff;
		color: #3730a3;
		border: 1px solid #c7d2fe;
		border-radius: 999px;
		padding: 0.2rem 0.6rem;
		font-size: 0.85rem;
	}
	:global(body.dark) .card {
		background: var(--dark-bg-tertiary);
		border-color: var(--dark-bg-tertiary);
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.35),
			0 2px 10px rgba(0, 0, 0, 0.25);
	}
	:global(body.dark) .muted {
		color: var(--dark-txt-secondary);
	}
	:global(body.dark) .list li {
		border-bottom: 1px dashed #2e3a59;
	}
	:global(body.dark) .k {
		color: var(--dark-txt-primary);
	}
	:global(body.dark) .v {
		color: var(--dark-txt-primary);
	}
	:global(body.dark) .pct {
		color: var(--dark-txt-secondary);
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0.25rem 0 0;
	}
	.list li {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.45rem 0.35rem;
		border-bottom: 1px dashed #eee;
	}
	.list li:last-child {
		border-bottom: none;
	}
	.k {
		max-width: 70%;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.v {
		font-weight: 700;
	}
	.pct {
		color: #6b7280;
		font-weight: 600;
		margin-left: 0.25rem;
	}
</style>
