<script lang="ts">
	import AttendanceViewNav from '../../../../components/AttendanceViewNav.svelte';

	export let data: {
		props: {
			outreachDays: Array<{
				id: string;
				year: number;
				datearray: number[];
				dateString: string;
			}>;
		};
	};
	export let form: { success?: boolean; message?: string } | null;

	const outreachDays = data.props.outreachDays;

	let date = '';
	let recalcYear = new Date().getFullYear() + 1; // Default to current school year

	function formatDateForDisplay(datearray: number[]): string {
		if (!datearray || datearray.length < 3) return 'Invalid date';
		const [year, month, day] = datearray;
		return `${month}/${day}/${year}`;
	}

	// Get unique years from outreach days
	$: uniqueYears = [...new Set(outreachDays.map((d) => d.year))].sort((a, b) => b - a);
</script>

<div class="text-column">
	<AttendanceViewNav current="outreach" />
	<h1>Outreach Days</h1>
	<p class="muted">
		Add special outreach days to the attendance system. These markers can be used for tracking and
		reporting purposes.
	</p>

	{#if form}
		<div class:notice-success={form.success} class:notice-error={!form.success} class="notice">
			{form.message}
		</div>
	{/if}

	<section class="add-section">
		<h2>Add New Outreach Day</h2>
		<form method="POST" action="?/create">
			<fieldset>
				<legend>Select Date</legend>
				<label>
					<span>Date</span>
					<input type="date" name="date" bind:value={date} required />
				</label>
				<p class="hint">
					School year is calculated as: June onwards = next calendar year. Example: July 2025 =
					School Year 2026. Outreach day cached counts will be updated after adding automatically.
				</p>
			</fieldset>
			<div class="actions">
				<button type="submit" class="primary">Add Outreach Day</button>
			</div>
		</form>
	</section>

	<section class="recalc-section">
		<h2>Recalculate Outreach Attendance</h2>
		<p class="muted">
			Recalculate and cache the outreach attendance counts for a specific year. This is
			automatically triggered when adding or deleting outreach days, but you can manually trigger it
			here.
		</p>
		<form method="POST" action="?/recalculate">
			<fieldset>
				<legend>Select Year</legend>
				<label>
					<span>School Year</span>
					<select name="year" bind:value={recalcYear} required>
						{#each uniqueYears as year}
							<option value={year}>{year}</option>
						{/each}
						{#if !uniqueYears.includes(recalcYear)}
							<option value={recalcYear}>{recalcYear}</option>
						{/if}
					</select>
				</label>
			</fieldset>
			<div class="actions">
				<button type="submit" class="secondary">Recalculate Cache</button>
			</div>
		</form>
	</section>

	<section class="list-section">
		<h2>Existing Outreach Days</h2>
		{#if outreachDays.length === 0}
			<p class="muted">No outreach days have been added yet.</p>
		{:else}
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>School Year</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each outreachDays as day}
						<tr>
							<td>{formatDateForDisplay(day.datearray)}</td>
							<td>{day.year}</td>
							<td>
								<form method="POST" action="?/delete" class="inline-form">
									<input type="hidden" name="id" value={day.id} />
									<button
										type="submit"
										class="delete-btn"
										on:click={(e) => {
											if (!confirm('Delete this outreach day?')) {
												e.preventDefault();
											}
										}}>Delete</button
									>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
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

	.notice {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	.notice-success {
		background: #d1fae5;
		color: #065f46;
		border: 1px solid #10b981;
	}

	.notice-error {
		background: #fee2e2;
		color: #991b1b;
		border: 1px solid #ef4444;
	}

	.add-section,
	.list-section,
	.recalc-section {
		margin-bottom: 2rem;
	}

	h2 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
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

	label {
		display: grid;
		gap: 0.25rem;
		margin-bottom: 0.5rem;
	}

	label span {
		font-weight: 600;
		font-size: 0.875rem;
	}

	input[type='date'] {
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 1rem;
		max-width: 300px;
	}

	select {
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 1rem;
		max-width: 300px;
		background: white;
		cursor: pointer;
	}

	.hint {
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.5rem;
		font-style: italic;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		background: white;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s;
	}

	button:hover {
		background: #f3f4f6;
	}

	.primary {
		background: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}

	.primary:hover {
		background: #2563eb;
	}

	.secondary {
		background: #10b981;
		color: white;
		border-color: #10b981;
	}

	.secondary:hover {
		background: #059669;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		overflow: hidden;
	}

	thead {
		background: #f9fafb;
	}

	th,
	td {
		padding: 0.75rem 1rem;
		text-align: left;
		border-bottom: 1px solid #e5e7eb;
	}

	th {
		font-weight: 600;
		font-size: 0.875rem;
		text-transform: uppercase;
		color: #6b7280;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	tbody tr:hover {
		background: #f9fafb;
	}

	.inline-form {
		margin: 0;
	}

	.delete-btn {
		background: #ef4444;
		color: white;
		border-color: #ef4444;
		padding: 0.25rem 0.75rem;
		font-size: 0.875rem;
	}

	.delete-btn:hover {
		background: #dc2626;
	}
</style>
