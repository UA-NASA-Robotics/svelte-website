<script>
	// Login page for attendance system, form to enter team password
	/** @type {import('./$types').ActionData}*/
	export let form;
</script>

<svelte:head>
	<title>Login - Attendance</title>
	<meta name="description" content="Login to track your attendance for club meetings and events." />
</svelte:head>

<div class="auth-wrapper">
	<div class="auth-card">
		<h1>Attendance Login</h1>
		<p class="subtitle">Sign in with the team password to record your attendance.</p>

		{#if form && form.error}
			<div class="alert" role="alert" aria-live="polite">{form.error}</div>
		{/if}

		<form method="POST" action="?/login_submission" class="form" aria-describedby="form-help">
			<div class="field">
				<label for="password">Team password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					autocomplete="current-password"
					placeholder="Enter team password"
				/>
			</div>

			<div class="field checkbox">
				<input type="checkbox" id="long-live" name="long-live" />
				<label for="long-live">Keep me signed in for 1 month</label>
			</div>

			<button type="submit" class="btn">Login</button>
			<p id="form-help" class="help">Use the team password provided by the officers.</p>
		</form>
	</div>
	<div class="auth-backdrop" aria-hidden="true"></div>
	<!-- decorative backdrop only -->
</div>

<style>
	.auth-wrapper {
		position: relative;
		min-height: 70vh;
		display: grid;
		place-items: center;
		padding: 2rem 1rem;
		overflow: hidden;
	}

	.auth-backdrop {
		position: absolute;
		inset: -10% -10% auto -10%;
		height: 40vh;
		background: radial-gradient(1200px 300px at 50% 0%, rgba(0, 76, 157, 0.12), rgba(0, 0, 0, 0));
		pointer-events: none;
		z-index: 0;
	}

	.auth-card {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 440px;
		padding: 2rem;
		border-radius: 16px;
		background: #fff;
		border: 1px solid var(--light-bg-secondary);
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.08),
			0 2px 10px rgba(0, 0, 0, 0.05);
	}

	:global(body.dark) .auth-card {
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

	.field.checkbox {
		flex-direction: row;
		align-items: center;
		gap: 0.6rem;
		margin-top: 0.25rem;
	}

	label {
		font-weight: 600;
		letter-spacing: 0.2px;
	}

	input[type='password'] {
		border: 1px solid var(--light-bg-secondary);
		background: #fff;
		color: var(--light-txt-primary);
		border-radius: 10px;
		padding: 0.8rem 0.9rem;
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

	input[type='checkbox'] {
		width: 18px;
		height: 18px;
		accent-color: var(--ua-blue);
	}

	:global(body.dark) input[type='checkbox'] {
		accent-color: var(--ua-light-blue);
	}

	.btn {
		margin-top: 0.25rem;
		background: var(--ua-blue);
		color: #fff;
		border: none;
		padding: 0.9rem 1rem;
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
		border: 1px solid #f3b4b4;
		background: #fdecec;
		color: #7a1f1f;
		padding: 0.75rem 1rem;
		border-radius: 10px;
		margin-bottom: 0.25rem;
	}

	:global(body.dark) .alert {
		border-color: #5c2b2b;
		background: #3b1f1f;
		color: #ffb3b3;
	}

	.help {
		margin: 0.25rem 0 0;
		font-size: 0.9rem;
		color: var(--light-txt-secondary);
		text-align: center;
	}

	:global(body.dark) .help {
		color: var(--dark-txt-secondary);
	}

	@media (max-width: 420px) {
		.auth-card {
			padding: 1.25rem;
			border-radius: 12px;
		}
	}
</style>
