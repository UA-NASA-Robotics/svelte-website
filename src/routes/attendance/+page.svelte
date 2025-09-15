<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	export let data;
	export let form;

	/** @type {HTMLInputElement | null} */
	let zipInput = null;
	onMount(() => {
		// Ensure the field is focused for card swipes without using the autofocus attribute
		setTimeout(() => zipInput?.focus(), 0);
	});
</script>

<svelte:head>
	<title>Attendance</title>
	<meta name="description" content="Track your attendance for club meetings and events." />
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
	<div class="attendance-wrapper">
		<div class="attendance-card">
			<h1>Record Attendance</h1>
			<p class="subtitle">
				Place the cursor in the field and swipe your Zip card. The reader will auto-submit.
				Alternatively, you can manually enter your 7-digit Zip ID.
			</p>

			{#if form}
				<div class="alert {form.success ? 'success' : 'error'}" role="status" aria-live="polite">
					{form.message}
				</div>
			{/if}
			{#if page.url.searchParams.get('demographics') === '1'}
				<div class="alert success" role="status" aria-live="polite">
					Demographics saved successfully.
				</div>
			{/if}

			<form method="POST" action="?/scan_submission" class="form" aria-describedby="help-text">
				<div class="field">
					<label for="zip">Zip card input</label>
					<input
						type="password"
						id="zip"
						name="zip"
						required
						bind:this={zipInput}
						autocomplete="off"
						spellcheck="false"
						inputmode="text"
						placeholder="Swipe your card now"
						aria-label="Zip card input"
					/>
				</div>
				<button type="submit" class="btn">Submit</button>
				<p id="help-text" class="help">
					For privacy, your swipe is hidden. If the reader doesn’t submit automatically, press
					Enter.
				</p>
			</form>
		</div>
		<div class="decor" aria-hidden="true"></div>
	</div>
{/if}

<style>
	.auth-wrapper,
	.attendance-wrapper {
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
	.attendance-card {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 640px;
		padding: 2rem;
		border-radius: 16px;
		background: #fff;
		border: 1px solid var(--light-bg-secondary);
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.08),
			0 2px 10px rgba(0, 0, 0, 0.05);
	}

	:global(body.dark) .auth-card,
	:global(body.dark) .attendance-card {
		background: var(--dark-bg-tertiary);
		border-color: var(--dark-bg-tertiary);
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.35),
			0 2px 10px rgba(0, 0, 0, 0.25);
	}

	.subtitle {
		margin-top: 0.25rem;
		margin-bottom: 1.25rem;
		text-align: center;
		color: var(--light-txt-secondary);
	}

	:global(body.dark) .subtitle {
		color: var(--dark-txt-secondary);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 600;
		letter-spacing: 0.2px;
	}

	input[type='password'] {
		border: 1px solid var(--light-bg-secondary);
		background: #fff;
		color: var(--light-txt-primary);
		border-radius: 12px;
		padding: 1rem 1.1rem;
		font-size: 1.25rem;
		letter-spacing: 0.08em;
		transition:
			border-color var(--transition-length),
			box-shadow var(--transition-length),
			background var(--transition-length);
	}

	input[type='password']::placeholder {
		color: #9aa1a9;
	}

	:global(body.dark) input[type='password'] {
		background: var(--dark-bg-primary);
		color: var(--dark-txt-primary);
		border-color: var(--dark-bg-secondary);
	}

	input[type='password']:focus {
		outline: none;
		border-color: var(--ua-blue);
		box-shadow: 0 0 0 4px rgba(0, 76, 157, 0.15);
	}

	:global(body.dark) input[type='password']:focus {
		border-color: var(--ua-light-blue);
		box-shadow: 0 0 0 4px rgba(88, 184, 253, 0.2);
	}

	.btn {
		align-self: center;
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
		margin-bottom: 0.5rem;
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

	.help {
		margin: 0.25rem 0 0;
		font-size: 0.95rem;
		color: var(--light-txt-secondary);
		text-align: center;
	}
	:global(body.dark) .help {
		color: var(--dark-txt-secondary);
	}

	@media (max-width: 480px) {
		.attendance-card {
			padding: 1.25rem;
			border-radius: 12px;
		}
		input[type='password'] {
			font-size: 1.1rem;
			padding: 0.9rem 1rem;
		}
	}
</style>
