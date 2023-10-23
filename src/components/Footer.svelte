<script lang="ts">
	const socialButtons = [
		{
			url: 'https://www.facebook.com/UANASArobotics/',
			imgSrc: 'src/lib/images/logo-facebook.png',
			alt: 'Facebook'
		},
		{
			url: 'https://twitter.com/UAkronRobotics',
			imgSrc: 'src/lib/images/logo-instagram.png',
			alt: 'Instagram'
		},
		{
			url: 'https://www.instagram.com/uakronrobotics/',
			imgSrc: 'src/lib/images/logo-x-twitter.webp',
			alt: 'X (FKA Twitter)'
		},
		{
			url: 'https://www.youtube.com/@uanasaroboticsteam',
			imgSrc: 'src/lib/images/logo-youtube.png',
			alt: 'Youtube'
		}
	];
</script>

<footer>
	<div>
		<p>Social</p>
		{#each socialButtons as { url, imgSrc, alt }}
			<a href={url}>
				<img src={imgSrc} {alt} />
			</a>
		{/each}
	</div>
	<p>© University of Akron NASA RMC Team 2023-2024</p>
</footer>

<style>
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
		align-items: center;
		justify-content: center;
		display: flex;
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
