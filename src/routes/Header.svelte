<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';

	type Route = {
		name: string;
		route: string;
	};

	type HeaderRoute = Route & {
		imgSrc: string;
		subroutes?: Route[];
	};

	const routes: HeaderRoute[] = [
		{
			name: 'Home',
			route: '/',
			imgSrc: ''
		},
		{
			name: 'Competition',
			route: '/about-competition',
			imgSrc: ''
		},
		{
			name: 'History',
			route: '/our-history',
			imgSrc: ''
		},
		{
			name: 'New Members',
			route: '/new-members',
			imgSrc: ''
		},
		{
			name: 'Sponsors',
			route: '/sponsors',
			imgSrc: ''
		},
		{
			name: 'Outreach',
			route: '/outreach',
			imgSrc: ''
		},
		{
			name: 'Officers',
			route: '/officers',
			imgSrc: ''
		},
		{
			name: 'Contact Us',
			route: '/contact-us',
			imgSrc: ''
		}
	];

	const Themes = {
		Light: 'Light',
		Dark: 'Dark'
	} as const;

	type ThemeKeys = keyof typeof Themes;
	type Theme = (typeof Themes)[ThemeKeys];

	let theme: Theme = Themes.Light;

	function changeTheme() {
		theme = theme == Themes.Light ? Themes.Dark : Themes.Light;
		localStorage.setItem('theme', theme);
		updateTheme();
	}

	function updateTheme() {
		if (theme === 'Dark') window.document.body.classList.add('dark');
		else window.document.body.classList.remove('dark');
	}

	function isTheme(theme: unknown): theme is Theme {
		for (const themeType of Object.keys(Themes)) {
			if (theme == themeType) return true;
		}

		return false;
	}

	//Header Background Img Load
	function headerBackgroundImageUpdate() {
		let currentUrl = window.location.href.split('/'); //split the url at the slashes
		let headerImgLink = currentUrl[currentUrl.length - 1]; //get the last item in the array the base page name
		headerImgLink = headerImgLink.split('?')[0]; //remove any query params
		if (headerImgLink == '') {
			//fix / index page
			headerImgLink = 'home';
		}
		let headerImgLinkPath = '/src/lib/images/' + headerImgLink + '.jpg'; //create the path to the image

		const header = document.querySelector('header'); //get the header element
		if (header) header.style.backgroundImage = 'url(' + headerImgLinkPath + ')'; //set the background image
	}

	onMount(() => {
		headerBackgroundImageUpdate();

		const value = localStorage.getItem('theme');

		if (isTheme(value)) {
			theme = value;
		} else {
			theme = Themes.Light;
		}

		updateTheme();
	});

	onNavigate(() => {
		headerBackgroundImageUpdate();
	});
</script>

<header>
	<div class="baseContainer">
		<img src="/src/lib/images/Logo.png" alt="NASA RMC Logo" />

		<nav>
			<ul>
				{#each routes as { name, route }}
					<li aria-current={$page.url.pathname === route ? 'page' : undefined}>
						<a href={route} aria-current={$page.url.pathname === route ? 'page' : undefined}>
							{name}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="switch-container">
			<p>{theme}</p>
			<label class="switch">
				<input type="checkbox" on:change={changeTheme} checked={theme === Themes.Dark} />
				<span class="slider round" />
			</label>
		</div>
	</div>
</header>

<style>
	header {
		/*display: flex;
		justify-content: space-between;*/
		position: relative;
		background-color: var(--light-bg-secondary);
		transition: color var(--transition-length) linear;

		-webkit-transition: var(--transition-length);

		background-image: ''; /*set by js on mount or navigate*/
		background-size: cover;
		background-repeat: no-repeat;
		background-attachment: fixed;
		height: 150px;
		background-position: center;
		box-shadow: inset 0 0 0 1000px rgba(25, 44, 139, 0.559);
	}

	:global(body.dark) header {
		background-color: var(--dark-bg-secondary);
	}

	.baseContainer {
		display: flex;
		justify-content: space-between;
		width: 100%;
		position: absolute;
		top: 0;
	}

	nav {
		display: flex;
		justify-content: center;
		flex: 1;
		align-self: center;
		position: relative;
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		transition: color var(--transition-length) linear;
		-webkit-transition: var(--transition-length);
	}

	p {
		color: var(--dark-txt-primary);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color var(--transition-length) linear;
		-webkit-transition: var(--transition-length);
	}

	:global(body.dark) p {
		color: var(--dark-txt-primary);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--dark-txt-primary);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color var(--transition-length) linear;
		-webkit-transition: var(--transition-length);
		border-radius: 5px;
		font-family: var(--title-font);
	}

	a:hover {
		color: var(--light-accent);
		transition: color var(--transition-length) linear;
		-webkit-transition: var(--transition-length);
	}

	:global(body.dark) a:hover {
		color: var(--dark-accent);
	}

	a[aria-current='page'] {
		background-color: var(--light-bg-secondary);
		color: var(--light-txt-secondary);
		transition: color var(--transition-length) linear;
		-webkit-transition: var(--transition-length);
	}

	:global(body.dark) a[aria-current='page'] {
		color: var(--dark-txt-secondary);
		background-color: var(--dark-bg-secondary);
	}

	img {
		height: 100px;
		align-self: center;
		margin: 5px;
	}

	.switch-container {
		align-items: center;
		margin: 20px;
		align-self: center;
		display: flex;
		flex-direction: column;
	}

	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	/* Hide default HTML checkbox */
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: var(--light-txt-secondary);
		-webkit-transition: var(--transition-length);
		transition: var(--transition-length);
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: var(--transition-length);
		transition: var(--transition-length);
	}

	input:checked + .slider {
		background-color: var(--light-accent);
		transition: color var(--transition-length) linear;
		-webkit-transition: var(--transition-length);
	}

	input:focus + .slider {
		box-shadow: 0 0 1px var(--light-accent);
		transition: color var(--transition-length) linear;
		-webkit-transition: var(--transition-length);
	}

	:global(body.dark) input:checked + .slider {
		background-color: var(--dark-accent);
	}

	:global(body.dark) input:focus + .slider {
		box-shadow: 0 0 1px var(--dark-accent);
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
</style>
