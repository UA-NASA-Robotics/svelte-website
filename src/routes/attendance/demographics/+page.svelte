<script lang="ts">
	// Data shape matches your server load returning { props: { zip, demographics } }
	export let data: {
		props: {
			zip: string;
			demographics: {
				email: string;
				yearsOnTeam: string | number;
				gender: string;
				major: string;
				ethnicity?: string;
				isHispanic?: string;
			};
		};
	};

	const { zip, demographics } = data.props;

	let email = demographics.email ?? '';
	let yearsOnTeam: string | number = demographics.yearsOnTeam ?? '';
	let gender = demographics.gender ?? '';
	let major = demographics.major ?? '';
	let ethnicity = demographics.ethnicity ?? '';
	let isHispanic = demographics.isHispanic ?? '';
</script>

<h1>Member Demographics</h1>
<p class="muted">
	Please fill out or update information here. Demographic data is anonymous and only reported to the
	University. You may opt out of responding to any section by leaving it blank.
</p>

<form method="POST" action="?/save_demographics" class="form-card" autocomplete="on">
	<input type="hidden" name="zip" value={zip} />

	<div class="form-grid">
		<div class="field">
			<label for="email">Email</label>
			<input
				id="email"
				name="email"
				type="email"
				placeholder="xxx1@uakron.edu"
				autocomplete="email"
				bind:value={email}
			/>
			<small class="hint">We may use this for club communications.</small>
		</div>

		<div class="field">
			<label for="yearsOnTeam">Completed Years on the Team</label>
			<input
				id="yearsOnTeam"
				name="yearsOnTeam"
				type="number"
				min="0"
				step="1"
				inputmode="numeric"
				placeholder="e.g., 1, 2, 3"
				bind:value={yearsOnTeam}
			/>
			<small class="hint">Only used for anonymous reporting. Enter whole years.</small>
		</div>

		<div class="field">
			<label for="gender">Gender</label>
			<input name="gender" type="text" bind:value={gender} />
			<small class="hint">Only used for anonymous University demographics reporting.</small>
		</div>

		<div class="field">
			<label for="major">Major</label>
			<input
				id="major"
				name="major"
				type="text"
				placeholder="e.g. Costume Technology Science"
				autocomplete="off"
				bind:value={major}
			/>
			<small class="hint">Only used for anonymous University demographics reporting.</small>
		</div>

		<div class="field">
			<label for="ethnicity">Ethnicity</label>
			<input
				id="ethnicity"
				name="ethnicity"
				type="text"
				placeholder="e.g., White, Black, Asian, etc."
				bind:value={ethnicity}
			/>
			<small class="hint">Only used for anonymous University demographics reporting.</small>
		</div>

		<div class="field">
			<label for="isHispanic">Hispanic/Latino</label>
			<select id="isHispanic" name="isHispanic" bind:value={isHispanic}>
				<option value="">Prefer not to say</option>
				<option value="Yes">Yes</option>
				<option value="No">No</option>
			</select>
			<small class="hint">Only used for anonymous University demographics reporting.</small>
		</div>
	</div>

	<div class="actions">
		<button class="btn primary" type="submit">Save demographics</button>
	</div>
</form>

<style>
	.text-column {
		max-width: 900px;
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
		margin: 0.25rem 0 0.5rem;
	}
	.muted {
		color: #666;
		margin-bottom: 1rem;
	}
	.form-card {
		background: #fff;
		border: 1px solid var(--light-bg-secondary);
		border-radius: 12px;
		padding: 1.25rem;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
	}
	.form-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}
	@media (min-width: 720px) {
		.form-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
	.field {
		display: flex;
		flex-direction: column;
	}
	label {
		font-weight: 600;
		margin-bottom: 0.35rem;
	}
	input,
	select {
		border: 1px solid var(--light-bg-secondary);
		border-radius: 8px;
		padding: 0.55rem 0.7rem;
		font-size: 1rem;
		background-color: #fff;
		color: var(--light-txt-primary);
	}
	input:focus,
	select:focus {
		outline: none;
		border-color: var(--ua-blue);
		box-shadow: 0 0 0 3px rgba(0, 76, 157, 0.15);
	}
	.hint {
		color: #6b7280;
		font-size: 0.85rem;
		margin-top: 0.35rem;
	}
	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 1rem;
	}
	.btn {
		border: 1px solid transparent;
		border-radius: 999px;
		padding: 0.55rem 1rem;
		font-weight: 600;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.btn.primary {
		background: #2563eb;
		color: #fff;
	}
	.btn.primary:hover {
		background: #1e40af;
	}
	:global(body.dark) .form-card {
		background: var(--dark-bg-tertiary);
		border-color: var(--dark-bg-tertiary);
	}
	:global(body.dark) label {
		color: var(--dark-txt-primary);
	}
	:global(body.dark) .muted {
		color: var(--dark-txt-secondary);
	}
	:global(body.dark) input,
	:global(body.dark) select {
		background: var(--dark-bg-primary);
		border-color: var(--dark-bg-secondary);
		color: var(--dark-txt-primary);
	}
	:global(body.dark) input:focus,
	:global(body.dark) select:focus {
		border-color: var(--ua-light-blue);
		box-shadow: 0 0 0 3px rgba(88, 184, 253, 0.2);
	}
</style>
