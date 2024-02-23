<script>
</script>

<svelte:head>
	<title>Contact Us</title>
	<meta name="description" content="Get in touch with us..." />
</svelte:head>

<div class="text-column">
	<h1>Contact Us</h1>
	<p>
		Do you have any questions or comments? Would you like to sponsor our team? Would you like to
		invite us to present to your group? Please reach out to us here. We will get back to you as soon
		as we can!
	</p>

	<div class="flex-columns">
		<form method="POST" action="/contact-us?/contact_submission" class="wide-input">
			<div class="thirds">
				<label for="name">Name</label>
				<input type="text" id="name" name="name" required />

				<div class="vertical-space" />

				<label for="email">Email or Phone Number</label>
				<input type="email" id="email" name="email" required />
			</div>

			<div class="two-thirds">
				<label for="message">Message</label> <br />
				<textarea id="message" name="message" class="wide-input" required /> <br />

				<button type="submit">Send</button>
			</div>
		</form>
	</div>
</div>

<style>
	.wide-input {
		width: 100%;
		display: flex;
	}

	.vertical-space {
		height: 1em;
	}

	button {
		color: var(--dark-txt-primary);
		background-color: var(--ua-blue);
		transition: color var(--transition-length) linear;
		-webkit-transition: var(--transition-length);
		border-radius: 0.5em;
		padding: 0.5em 1em;
	}

	:global(body.dark) button {
		background-color: var(--ua-gold);
		color: var(--light-txt-primary);
	}
</style>
