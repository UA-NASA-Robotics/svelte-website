<script lang="ts">
	export let data: {
		props: {
			enabled: boolean;
			majorOptions: string[];
		};
	};

	export let form: {
		success?: boolean;
		message?: string;
		error?: string;
		values?: {
			name: string;
			email: string;
			major: string;
			customMajor: string;
		};
	} | null = null;

	const { enabled, majorOptions } = data.props;
	const initialValues = form?.values ?? {
		name: '',
		email: '',
		major: '',
		customMajor: ''
	};

	let name = initialValues.name;
	let email = initialValues.email;
	let major = initialValues.major;
	let customMajor = initialValues.customMajor;
</script>

<svelte:head>
	<title>Email Signup</title>
	<meta
		name="description"
		content="Join the University of Akron NASA Robotics mailing list for team updates and announcements."
	/>
</svelte:head>

<div class="signup-shell">
	<section class="hero">
		<p class="eyebrow">Stay Connected</p>
		<h1>Join the team mailing list</h1>
		<p class="lede">
			Get meeting updates, reminders, and announcements sent to your University of Akron email.
		</p>
	</section>

	{#if form?.message}
		<div
			class:notice-success={form.success}
			class:notice-error={!form.success}
			class="notice"
			role="status"
		>
			{form.message}
		</div>
	{:else if form?.error}
		<div class="notice notice-error" role="alert">{form.error}</div>
	{/if}

	{#if enabled}
		<form method="POST" class="signup-card" aria-describedby="signup-help">
			<div class="field-grid">
				<div class="field">
					<label for="name">Name</label>
					<input id="name" name="name" type="text" bind:value={name} required autocomplete="name" />
				</div>

				<div class="field">
					<label for="email">UAkron email</label>
					<input
						id="email"
						name="email"
						type="email"
						bind:value={email}
						required
						autocomplete="email"
						placeholder="abc123@uakron.edu"
					/>
					<small class="hint">Only @uakron.edu addresses are accepted.</small>
				</div>

				<div class="field">
					<label for="major">Major</label>
					<select id="major" name="major" bind:value={major}>
						<option value="">Select a major (optional)</option>
						{#each majorOptions as option}
							<option value={option}>{option}</option>
						{/each}
						<option value="__custom__">Not listed</option>
					</select>
				</div>

				<div class="field">
					<label for="customMajor">Custom major</label>
					<input
						id="customMajor"
						name="customMajor"
						type="text"
						bind:value={customMajor}
						autocomplete="off"
						placeholder="Use this if your major is not in the list"
					/>
					<small class="hint">If you type here, it overrides the dropdown choice.</small>
				</div>
			</div>

			<p id="signup-help" class="help">
				This list is used for club communication only. Duplicate prevention is not enforced.
			</p>

			<div class="actions">
				<button type="submit">Join the Mailing List</button>
			</div>
		</form>
	{:else}
		<section class="signup-card closed" aria-live="polite">
			<h2>Signup is currently closed</h2>
			<p>
				The mailing list form is temporarily unavailable. Please check back later or contact the
				team directly if you need immediate help.
			</p>
		</section>
	{/if}
</div>

<style>
	.signup-shell {
		max-width: 900px;
		margin: 0 auto;
		padding: 1rem 0 2rem;
	}

	.hero {
		padding: 1.5rem 1.5rem 1rem;
		border-radius: 24px;
		background: linear-gradient(135deg, rgba(0, 76, 157, 0.12), rgba(255, 198, 39, 0.14)),
			linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98));
		border: 1px solid rgba(0, 76, 157, 0.12);
		box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
		margin-bottom: 1rem;
	}

	.eyebrow {
		margin: 0 0 0.35rem;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ua-blue);
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 5vw, 3.2rem);
		line-height: 1.05;
	}

	.lede {
		margin: 0.75rem 0 0;
		max-width: 42rem;
		font-size: 1.05rem;
		color: var(--light-txt-secondary);
	}

	.signup-card {
		background: #ffffff;
		border: 1px solid var(--light-bg-secondary);
		border-radius: 20px;
		padding: 1.5rem;
		box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
	}

	.closed {
		text-align: center;
	}

	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	label {
		font-weight: 700;
	}

	input,
	select {
		padding: 0.8rem 0.9rem;
		border: 1px solid var(--light-bg-secondary);
		border-radius: 12px;
		font-size: 1rem;
		background: #fff;
		color: var(--light-txt-primary);
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: var(--ua-blue);
		box-shadow: 0 0 0 4px rgba(0, 76, 157, 0.14);
	}

	.hint,
	.help {
		color: var(--light-txt-secondary);
	}

	.help {
		margin: 1rem 0 0;
	}

	.actions {
		margin-top: 1.25rem;
		display: flex;
		justify-content: flex-start;
	}

	button {
		border: none;
		border-radius: 999px;
		padding: 0.9rem 1.3rem;
		font-size: 1rem;
		font-weight: 700;
		color: #fff;
		background: linear-gradient(135deg, var(--ua-blue), var(--ua-dark-blue));
		cursor: pointer;
		box-shadow: 0 12px 28px rgba(0, 76, 157, 0.25);
	}

	button:hover {
		filter: brightness(1.05);
	}

	.notice {
		margin: 0 0 1rem;
		padding: 0.9rem 1rem;
		border-radius: 12px;
		font-weight: 600;
	}

	.notice-success {
		background: #e6f8ec;
		border: 1px solid #8ed0a5;
		color: #14532d;
	}

	.notice-error {
		background: #fdecec;
		border: 1px solid #f1b1b1;
		color: #7a1f1f;
	}

	:global(body.dark) .hero {
		background: linear-gradient(135deg, rgba(0, 76, 157, 0.24), rgba(255, 198, 39, 0.16)),
			linear-gradient(180deg, rgba(28, 35, 51, 0.96), rgba(28, 35, 51, 0.98));
		border-color: rgba(88, 184, 253, 0.2);
	}

	:global(body.dark) .lede,
	:global(body.dark) .hint,
	:global(body.dark) .help {
		color: var(--dark-txt-secondary);
	}

	:global(body.dark) .signup-card {
		background: var(--dark-bg-tertiary);
		border-color: var(--dark-bg-secondary);
	}

	:global(body.dark) input,
	:global(body.dark) select {
		background: var(--dark-bg-primary);
		border-color: var(--dark-bg-secondary);
		color: var(--dark-txt-primary);
	}

	:global(body.dark) .notice-success {
		background: rgba(20, 83, 45, 0.45);
		border-color: rgba(74, 222, 128, 0.55);
		color: #d1fae5;
	}

	:global(body.dark) .notice-error {
		background: rgba(127, 29, 29, 0.45);
		border-color: rgba(248, 113, 113, 0.55);
		color: #fecaca;
	}

	@media (max-width: 720px) {
		.field-grid {
			grid-template-columns: 1fr;
		}

		.signup-card,
		.hero {
			padding: 1.2rem;
		}
	}
</style>
