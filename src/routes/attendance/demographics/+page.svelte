<script lang="ts">
	// Data shape matches your server load returning { props: { zip, demographics } }
	export let data: {
		props: {
			zip: string;
			demographics: { email: string; age: string | number; gender: string; major: string };
		};
	};

	const { zip, demographics } = data.props;

	let email = demographics.email ?? '';
	let age: string | number = demographics.age ?? '';
	let gender = demographics.gender ?? '';
	let major = demographics.major ?? '';
</script>

<h1>Member Demographics</h1>
<p class="muted">Please fill out or update information here.</p>

<form method="POST" action="?/save_demographics" class="form-card" autocomplete="on">
	<input type="hidden" name="zip" value={zip} />

	<div class="form-grid">
		<div class="field">
			<label for="email">Email *</label>
			<input
				id="email"
				name="email"
				type="email"
				required
				placeholder="xxx1@uakron.edu"
				autocomplete="email"
				bind:value={email}
			/>
			<small class="hint">We may use this for club communications.</small>
		</div>

		<div class="field">
			<label for="age">Age *</label>
			<input
				id="age"
				name="age"
				type="number"
				min="0"
				inputmode="numeric"
				placeholder="120"
				required
				bind:value={age}
			/>
			<small class="hint">Only used for anonymous University demographics reporting.</small>
		</div>

		<div class="field">
			<label for="gender">Gender *</label>
			<input name="gender" type="text" required bind:value={gender} />
			<small class="hint">Only used for anonymous University demographics reporting.</small>
		</div>

		<div class="field">
			<label for="major">Major *</label>
			<input
				id="major"
				name="major"
				type="text"
				required
				placeholder="Costume Technology Science"
				autocomplete="off"
				bind:value={major}
			/>
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
		border: 1px solid #e5e7eb;
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
		border: 1px solid #d1d5db;
		border-radius: 8px;
		padding: 0.55rem 0.7rem;
		font-size: 1rem;
		background-color: #fff;
	}
	input:focus,
	select:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
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
	.btn.secondary {
		background: #f3f4f6;
		color: #111827;
		border-color: #e5e7eb;
	}
	.btn.secondary:hover {
		background: #e5e7eb;
	}
</style>
