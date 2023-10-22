<script>
	import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<div>
			<p>Social</p>
			<a class="facebook-button">
				<img src="https://logodownload.org/wp-content/uploads/2014/09/facebook-logo-1-2.png" />
			</a>
			<a class="instagram-button">
				<img src="https://clipartcraft.com/images/instagram-logo-transparent-png-format-3.png" />
			</a>
			<a class="twitter-button">
				<img src="https://freelogopng.com/images/all_img/1690643591twitter-x-logo-png.png" />
			</a>
			<a class="youtube-button">
				<img
					src="https://hdclipartall.com/images/youtube-clipart-youtube-square-icons-1600x1600.png"
				/>
			</a>
		</div>
		<p>© University of Akron NASA RMC Team 2023-2024</p>
	</footer>
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
