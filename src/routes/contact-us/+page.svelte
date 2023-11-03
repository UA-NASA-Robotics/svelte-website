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
		invite us to present to your group? Please reach out to us here!
	</p>

	<form method="POST" action="/contact-us?/contact_submission">
		<label for="name">Name</label>
		<input type="text" id="name" name="name" required />

		<label for="email">Email</label>
		<input type="email" id="email" name="email" required />

		<label for="message">Message</label>
		<textarea id="message" name="message" required />

		<button type="submit">Send</button>
	</form>
</div>
