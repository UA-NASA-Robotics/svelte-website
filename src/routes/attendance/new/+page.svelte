<script>
	import { onMount } from 'svelte';

	export let data;
	export let form;

	/** @type {HTMLInputElement | null} */
	let nameInput = null;
	/** @type {HTMLInputElement | null} */
	let zipInput = null;

	onMount(() => {
		// Prefill ZIP from URL params if present and focus the Name field
		const urlParams = new URLSearchParams(window.location.search);
		const zip = urlParams.get('zip');
		if (zip && zipInput) {
			zipInput.value = zip;
			zipInput.readOnly = true;
		}
		// Focus name input without using autofocus to avoid a11y warning
		setTimeout(() => nameInput?.focus(), 0);
	});
</script>

<svelte:head>
	<title>New Attendance Entry</title>
	<meta name="description" content="Create a new attendance entry for club meetings and events." />
</svelte:head>

{#if !data.props.authenticated}
	<div class="auth-wrapper">
		<div class="auth-card">
			<h2>Not Logged in</h2>
			<p>
				You must be logged in to view this page. Please <a href="/attendance/login">login here</a>.
			</p>
		</div>
	</div>
{:else}
	<div class="new-wrapper">
		<div class="new-card">
			<h1>New Attendance Entry</h1>
			<p class="subtitle">
				Fill this out once to create your member record. You’ll then be redirected to sign in.
			</p>

			{#if form}
				<div class="alert {form.success ? 'success' : 'error'}" role="status" aria-live="polite">
					{form.message}
				</div>
			{/if}

			<form class="new-entry-form" method="POST" action="?/new_submission">
				<div class="form-grid">
					<!-- Left column -->
					<div class="col-left">
						<div class="field">
							<label for="name">Full Name</label>
							<input
								type="text"
								id="name"
								name="name"
								required
								bind:this={nameInput}
								placeholder="First Last"
							/>
						</div>

						<div class="field">
							<label for="zip">Zip ID</label>
							<input
								type="text"
								id="zip"
								name="zip"
								required
								bind:this={zipInput}
								placeholder="Zip from card (wth 8 leading zeros)"
							/>
						</div>
					</div>

					<!-- Right column -->
					<div class="col-right">
						<fieldset class="fieldset">
							<legend>Sub-team</legend>
							<label class="radio">
								<input type="radio" id="mechanical" name="subteam" value="Mechanical" required />
								Mechanical
							</label>
							<label class="radio">
								<input type="radio" id="electrical" name="subteam" value="Electrical" />
								Electrical
							</label>
							<label class="radio">
								<input type="radio" id="software" name="subteam" value="Software" />
								Software
							</label>
							<label class="radio">
								<input type="radio" id="other" name="subteam" value="Other" />
								Other/Mgmt
							</label>
						</fieldset>

						<button class="btn" type="submit">Create entry</button>
					</div>
				</div>
			</form>
		</div>
		<div class="decor" aria-hidden="true"></div>
	</div>
{/if}

<style>
	.auth-wrapper,
	.new-wrapper {
		min-height: 60vh;
		display: grid;
		place-items: center;
		padding: 2rem 1rem;
		position: relative;
	}

	.decor {
		position: absolute;
		inset: -10% -10% auto -10%;
		height: 35vh;
		background: radial-gradient(1200px 280px at 50% 0%, rgba(0, 76, 157, 0.12), rgba(0, 0, 0, 0));
		pointer-events: none;
		z-index: 0;
	}

	.auth-card,
	.new-card {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 980px;
		padding: 2rem;
		border-radius: 16px;
		background: #fff;
		border: 1px solid var(--light-bg-secondary);
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.08),
			0 2px 10px rgba(0, 0, 0, 0.05);
	}

	:global(body.dark) .auth-card,
	:global(body.dark) .new-card {
		background: var(--dark-bg-tertiary);
		border-color: var(--dark-bg-tertiary);
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.35),
			0 2px 10px rgba(0, 0, 0, 0.25);
	}

	.subtitle {
		margin-top: 0.25rem;
		margin-bottom: 1.5rem;
		text-align: center;
		color: var(--light-txt-secondary);
	}
	:global(body.dark) .subtitle {
		color: var(--dark-txt-secondary);
	}

	.new-entry-form {
		max-width: 100%;
		margin: 0 auto;
	}
	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		align-items: start;
	}
	.col-left,
	.col-right {
		width: 100%;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	.field label {
		font-weight: 600;
		letter-spacing: 0.2px;
	}
	.field input[type='text'] {
		padding: 0.8rem 0.9rem;
		border: 1px solid var(--light-bg-secondary);
		border-radius: 10px;
		background: #fff;
		color: var(--light-txt-primary);
		transition:
			border-color var(--transition-length),
			box-shadow var(--transition-length),
			background var(--transition-length);
	}
	:global(body.dark) .field input[type='text'] {
		background: var(--dark-bg-primary);
		color: var(--dark-txt-primary);
		border-color: var(--dark-bg-secondary);
	}
	.field input[type='text']::placeholder {
		color: #9aa1a9;
	}
	.field input[type='text']:focus {
		outline: none;
		border-color: var(--ua-blue);
		box-shadow: 0 0 0 4px rgba(0, 76, 157, 0.15);
	}
	:global(body.dark) .field input[type='text']:focus {
		border-color: var(--ua-light-blue);
		box-shadow: 0 0 0 4px rgba(88, 184, 253, 0.2);
	}

	fieldset.fieldset {
		border: 1px solid var(--light-bg-secondary);
		border-radius: 12px;
		padding: 0.75rem 1rem 1rem;
	}
	:global(body.dark) fieldset.fieldset {
		border-color: var(--dark-bg-secondary);
	}
	fieldset.fieldset legend {
		padding: 0 0.25rem;
		font-weight: 700;
	}
	.radio {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0.45rem 0;
	}
	.radio input[type='radio'] {
		accent-color: var(--ua-blue);
	}
	:global(body.dark) .radio input[type='radio'] {
		accent-color: var(--ua-light-blue);
	}

	.btn {
		margin-top: 1rem;
		background: var(--ua-blue);
		color: #fff;
		border: none;
		padding: 0.9rem 1.25rem;
		border-radius: 12px;
		font-weight: 700;
		letter-spacing: 0.3px;
		cursor: pointer;
		transition:
			background var(--transition-length),
			transform 120ms ease;
	}
	.btn:hover {
		background: var(--ua-dark-blue);
	}
	.btn:active {
		transform: translateY(1px);
	}
	.btn:focus-visible {
		outline: 3px solid rgba(0, 76, 157, 0.35);
		outline-offset: 2px;
	}

	.alert {
		border: 1px solid var(--light-bg-secondary);
		background: #f5f7fb;
		color: var(--light-txt-primary);
		padding: 0.75rem 1rem;
		border-radius: 10px;
		margin-bottom: 0.75rem;
		text-align: center;
	}
	.alert.error {
		border-color: #f3b4b4;
		background: #fdecec;
		color: #7a1f1f;
	}
	.alert.success {
		border-color: #b6e3b6;
		background: #edf9ed;
		color: #1f7a1f;
	}
	:global(body.dark) .alert {
		background: #263149;
		border-color: #2e3a59;
		color: var(--dark-txt-primary);
	}
	:global(body.dark) .alert.error {
		border-color: #5c2b2b;
		background: #3b1f1f;
		color: #ffb3b3;
	}
	:global(body.dark) .alert.success {
		border-color: #264b2b;
		background: #1f3b23;
		color: #b9f5c0;
	}

	/* Responsive */
	@media (max-width: 820px) {
		.form-grid {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 480px) {
		.new-card {
			padding: 1.25rem;
			border-radius: 12px;
		}
		.field input[type='text'] {
			padding: 0.75rem 0.85rem;
		}
	}
</style>
