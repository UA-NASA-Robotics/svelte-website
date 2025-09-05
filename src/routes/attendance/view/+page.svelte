<script lang="ts">
	import AttendanceViewNav from '../../../components/AttendanceViewNav.svelte';
	export let data: {
		props: {
			gender: { key: string | number; value: number }[];
			major: { key: string | number; value: number }[];
			years: { key: string | number; value: number }[];
		};
	};

	const { gender, major, years } = data.props;

	function total(rows: { value: number }[]) {
		return rows.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
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
						<li><span class="k">{row.key || 'Unknown'}</span><span class="v">{row.value}</span></li>
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
							<span class="k">{row.key || 'Unknown'}</span><span class="v">{row.value}</span>
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
						<li><span class="k">{row.key || 'Unknown'}</span><span class="v">{row.value}</span></li>
					{/each}
				</ul>
			{:else}
				<p class="muted">No data.</p>
			{/if}
		</div>
	</section>
</div>

<style>
	.text-column {
		max-width: 1000px;
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

	.cards {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
	}
	@media (min-width: 920px) {
		.cards {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.card {
		background: #fff;
		border: 1px solid #e5e7eb;
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
</style>
