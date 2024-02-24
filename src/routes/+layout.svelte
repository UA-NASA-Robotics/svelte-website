<script>
	import Header from '../components/Header.svelte';
	import './styles.css';
	import Footer from '../components/Footer.svelte';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<Footer />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--light-bg-primary);
		transition: color var(--transition-length) linear;
		-webkit-transition: var(--transition-length);
	}

	:global(body.dark) .app {
		background-color: var(--dark-bg-primary);
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	footer div {
		display: flex;
		column-gap: 10px;
		align-items: center;
	}

	footer div a {
		width: 50px;
		height: 50px;
		align-items: center;
		justify-content: center;
		display: flex;
	}

	.facebook-button {
		background-color: blue;
	}

	.instagram-button {
		background-color: blueviolet;
	}

	.twitter-button {
		background-color: black;
	}

	.youtube-button {
		background-color: red;
	}

	footer div a img {
		width: 30px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
