<script lang="ts">
	import AttendanceViewNav from '../../../../components/AttendanceViewNav.svelte';
	export let data: {
		props: {
			active: {
				zip: string;
				name: string;
				subTeam: string;
				email: string;
				count: number;
				duesPaid?: boolean;
			}[];
			inactive: {
				zip: string;
				name: string;
				subTeam: string;
				email: string;
				count: number;
				duesPaid?: boolean;
			}[];
			years?: string[];
			selectedYear?: string;
		};
	};

	const { active, inactive, years = [], selectedYear = '' } = data.props;

	let expanded: Record<string, { loading: boolean; dates: string[] | null }> = {};
	let exporting = false;

	// Build and download a CSV with columns: Name, Total, ...dates
	// Rows correspond to each member; cells are 1 for present, blank for absent
	function csvEscape(v: string): string {
		// Always quote; escape quotes by doubling them
		const s = (v ?? '').toString().replace(/"/g, '""');
		return `"${s}"`;
	}

	function tryParseDate(s: string): number | null {
		const d = new Date(s);
		if (!isNaN(d.getTime())) return d.getTime();
		// Try common MM/DD/YYYY or YYYY-MM-DD formats
		const mdy = s.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/);
		if (mdy) {
			const mm = Number(mdy[1]);
			const dd = Number(mdy[2]);
			const yy = Number(mdy[3]);
			const dt = new Date(yy, mm - 1, dd);
			if (!isNaN(dt.getTime())) return dt.getTime();
		}
		const iso = s.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
		if (iso) {
			const yy = Number(iso[1]);
			const mm = Number(iso[2]);
			const dd = Number(iso[3]);
			const dt = new Date(yy, mm - 1, dd);
			if (!isNaN(dt.getTime())) return dt.getTime();
		}
		return null;
	}

	function toYMD(d: Date): string {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}

	// Normalize any date string to a day-level key (YYYY-MM-DD)
	function normalizeDateToDay(s: string): string {
		const v = String(s || '').trim();
		if (!v) return v;
		const d1 = new Date(v);
		if (!isNaN(d1.getTime())) return toYMD(d1);
		const mdy = v.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/);
		if (mdy) {
			const mm = Number(mdy[1]);
			const dd = Number(mdy[2]);
			const yy = Number(mdy[3]);
			const dt = new Date(yy, mm - 1, dd);
			if (!isNaN(dt.getTime())) return toYMD(dt);
		}
		const iso = v.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
		if (iso) {
			const yy = Number(iso[1]);
			const mm = Number(iso[2]);
			const dd = Number(iso[3]);
			const dt = new Date(yy, mm - 1, dd);
			if (!isNaN(dt.getTime())) return toYMD(dt);
		}
		// Fallback: drop time by splitting at comma
		return v.split(',')[0].trim();
	}

	function sortDates(a: string, b: string): number {
		const ta = tryParseDate(a);
		const tb = tryParseDate(b);
		if (ta != null && tb != null) return ta - tb;
		if (ta != null) return -1;
		if (tb != null) return 1;
		return a.localeCompare(b);
	}

	async function fetchDatesFor(zip: string): Promise<string[]> {
		const params = new URLSearchParams({ zip });
		if (selectedYear) params.set('year', selectedYear);
		const res = await fetch(`/attendance/view/attendance/dates?${params.toString()}`);
		if (!res.ok) return [];
		const body: { dates?: string[] } = await res.json();
		return body.dates ?? [];
	}

	async function exportCSV() {
		if (exporting) return;
		exporting = true;
		try {
			const members = [...active, ...inactive];
			// Fetch dates for each member in parallel
			const memberDates = await Promise.all(
				members.map(async (m) => {
					const dates = await fetchDatesFor(m.zip);
					// Normalize to day-level keys
					const daySet = new Set<string>(dates.map((d) => normalizeDateToDay(d)));
					return { zip: m.zip, name: m.name, days: daySet, subTeam: m.subTeam, email: m.email };
				})
			);
			// Build union of all dates
			const allDatesSet = new Set<string>();
			for (const md of memberDates) {
				for (const d of md.days) allDatesSet.add(d);
			}
			const allDates = Array.from(allDatesSet);
			allDates.sort(sortDates);

			// Header: Name, Total, ...dates
			const header = ['Name', 'Total', ...allDates];
			const rows: string[] = [];
			rows.push(header.map(csvEscape).join(','));
			for (const m of memberDates) {
				const total = m.days.size; // total unique days
				const cells: string[] = [csvEscape(m.name), String(total)];
				for (const d of allDates) {
					cells.push(m.days.has(d) ? '1' : '');
				}
				rows.push(cells.join(','));
			}

			const csvContent = '\ufeff' + rows.join('\r\n'); // BOM for Excel UTF-8
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			const yrPart = selectedYear ? `_${selectedYear}` : '_all-years';
			a.href = url;
			a.download = `attendance${yrPart}.csv`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (e) {
			console.error('Export failed', e);
		} finally {
			exporting = false;
		}
	}

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
		<button
			type="button"
			class="export-btn"
			on:click={exportCSV}
			disabled={exporting}
			title="Download CSV"
		>
			{exporting ? 'Exporting…' : 'Export CSV'}
		</button>
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
								<label class="dues" class:paid={m.duesPaid} class:unpaid={!m.duesPaid}>
									<input type="checkbox" checked={m.duesPaid} disabled />
									<span title="Dues paid for selected year">Dues</span>
								</label>
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
								<label class="dues" class:paid={m.duesPaid} class:unpaid={!m.duesPaid}>
									<input type="checkbox" checked={m.duesPaid} disabled />
									<span title="Dues paid for selected year">Dues</span>
								</label>
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
	.export-btn {
		border: 1px solid var(--light-bg-secondary);
		border-radius: 8px;
		padding: 0.4rem 0.6rem;
		background: #111827;
		color: #fff;
		cursor: pointer;
	}
	.export-btn[disabled] {
		opacity: 0.7;
		cursor: not-allowed;
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
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: center;
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
	.dues {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.9rem;
		border: 1px solid #e5e7eb;
		border-radius: 999px;
		padding: 0.2rem 0.5rem;
		background: #f9fafb;
		color: #111827;
	}
	.dues input[type='checkbox'] {
		transform: scale(1.15);
	}
	.dues.paid {
		background: #ecfdf5;
		border-color: #a7f3d0;
		color: #065f46;
	}
	.dues.unpaid {
		background: #fff7ed;
		border-color: #fed7aa;
		color: #9a3412;
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
	:global(body.dark) .dues {
		background: var(--dark-bg-secondary);
		border-color: var(--dark-bg-secondary);
		color: var(--dark-txt-primary);
	}
	:global(body.dark) .dues.paid {
		background: #0c3b2e;
		border-color: #115e45;
		color: #a7f3d0;
	}
	:global(body.dark) .dues.unpaid {
		background: #3a2413;
		border-color: #7c3e1d;
		color: #fdba74;
	}
</style>
