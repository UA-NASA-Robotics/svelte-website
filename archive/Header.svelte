<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { getRoutes } from '../src/components/Sitemap';

	type Route = {
		name: string;
		route: string;
	};

	type HeaderLink = {
		name: string;
		imgSrc: string;
	};

	type HeaderRouteWithoutSubroutes = Route & HeaderLink;

	type HeaderRouteWithSubroutes = HeaderLink & {
		route?: string;
		subroutes: Route[];
	};

	type HeaderRoute = HeaderRouteWithoutSubroutes | HeaderRouteWithSubroutes;

	const routes: HeaderRoute[] = getRoutes();

	const Themes = {
		Light: 'Light',
		Dark: 'Dark'
	} as const;

	type ThemeKeys = keyof typeof Themes;
	type Theme = (typeof Themes)[ThemeKeys];

	let theme: Theme = Themes.Light;
	let menuExpanded: boolean = false;

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
		let currentUrl = window.location.href; //split the url at the slashes
		currentUrl = currentUrl.split('?')[0]; //remove any query params
		let currentUrllist = currentUrl.split('/'); //split the url at the slashes
		let headerImgLink = currentUrllist[currentUrllist.length - 1]; //get the last item in the array the base page name

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

	//Hamgurger Helper
	function toggleCollapsedTopNav() {
		menuExpanded = !menuExpanded;
		if (menuExpanded) window.document.body.classList.add('menu-hidden');
		else window.document.body.classList.remove('menu-hidden');
		// var x = document.getElementById('HeaderMenu');
		// var y = document.getElementById('header');
		// if (x !== null && y !== null) {
		// 	if (x.className.match('responsive') === null) {
		// 		x.className += ' responsive';
		// 		y.className += ' header-responsive';
		// 	} else {
		// 		x.className = x.className.replace(' responsive', '');
		// 		y.className = y.className.replace(' header-responsive', '');
		// 	}
		// } else {
		// 	console.log('No TopNav Found in Header.svelte or Header.svelte not found');
		// }
	}
</script>

<header class="" id="header">
	<div class="baseContainer">
		<img src="/src/lib/images/Logo.png" alt="NASA RMC Logo" />

		<nav class="topNav" id="HeaderMenu">
			<ul>
				{#each routes as route}
					{#if 'subroutes' in route}
						<li
							aria-current={$page.url.pathname === route.route ||
							route.subroutes.some((sub) => sub.route === $page.url.pathname)
								? 'page'
								: undefined}
							class="dropdown"
						>
							<a
								href={route.route}
								aria-current={$page.url.pathname === route.route ||
								route.subroutes.some((sub) => sub.route === $page.url.pathname)
									? 'page'
									: undefined}
								class="dropbtn"
							>
								{route.name}
							</a>
							<div class="dropdown-content">
								{#each route.subroutes as sub}
									<a
										href={sub.route}
										aria-current={$page.url.pathname === sub.route ? 'page' : undefined}
									>
										{sub.name}
									</a>
								{/each}
							</div>
						</li>
					{:else}
						<li aria-current={$page.url.pathname === route.route ? 'page' : undefined}>
							<a
								href={route.route}
								aria-current={$page.url.pathname === route.route ? 'page' : undefined}
							>
								{route.name}
							</a>
						</li>
					{/if}
				{/each}
				<li class="icon">
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a href="javascript:void(0);" class="icon" on:click={toggleCollapsedTopNav}>
						<i class="fa-solid fa-bars" />
					</a>
				</li>
			</ul>
		</nav>

		<label class="switch">
			<input type="checkbox" on:change={changeTheme} checked={theme === Themes.Dark} />
			<span class="slider round">
				<i
					class={theme === Themes.Light
						? 'theme-icon fa-solid fa-sun'
						: 'theme-icon fa-solid fa-moon'}
				/>
			</span>
		</label>
	</div>
</header>

<style>
	:root {
		--header-height: 20vh;
		--extra-tall-header-height: 50vh;
	}

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
		height: var(--header-height);
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

	/*p {
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
	}*/

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
		cursor: pointer;
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

	.topNav ul li.icon {
		display: none;
	}
	.fa-bars {
		color: var(--light-accent);
	}
	:global(body.dark) .fa-bars {
		color: var(--dark-accents);
	}

	/* When the screen is less than 600 pixels wide, hide all links, except for the first one ("Home"). Show the link that contains should open and close the topnav (.icon) */
	@media screen and (max-width: 600px) {
		.topNav ul li:not(:first-child) {
			display: none;
		}
		.topNav ul li.icon {
			float: right;
			display: flex;
			flex-direction: column;
			width: 1em;
		}

		header {
			height: var(--extra-tall-header-height);
		}
	}

	/* The "responsive" class is added to the topnav with JavaScript when the user clicks on the icon. 
	This class makes the topnav look good on small screens (display the links vertically instead of horizontally) */
	@media screen and (max-width: 600px) {
		.topNav.responsive ul li {
			position: relative;
			display: block;
			text-align: center;
		}
		.topNav.responsive ul li.icon {
			position: absolute;
			right: 0;
			top: 0;
		}
	}

	img {
		height: 100px;
		align-self: center;
		margin: 5px;
	}

	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
		align-self: center;
		margin: 20px;
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
		background-color: var(--light-bg-primary);
		-webkit-transition: var(--transition-length);
		transition: var(--transition-length);
		display: flex;
	}

	/* .slider:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: var(--transition-length);
		transition: var(--transition-length);
	} */

	input + .slider {
		align-items: center;
		justify-content: center;
		font-family: 'Font Awesome 5 Free';
		content: '\f00c';
		color: #000;
		font-weight: 600;
	}

	input:checked + .slider {
		background-color: var(--dark-bg-primary);
		transition: color var(--transition-length) linear;
		-webkit-transition: var(--transition-length);
	}

	input:focus + .slider {
		box-shadow: 0 0 1px var(--light-accent);
		transition: color var(--transition-length) linear;
		-webkit-transition: var(--transition-length);
	}

	:global(body.dark) input:checked + .slider {
		background-color: var(--dark-bg-primary);
	}

	:global(body.dark) input:focus + .slider {
		box-shadow: 0 0 1px var(--dark-bg-primary);
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

	.theme-icon {
		font-size: large;
		color: var(--light-txt-primary);
		-webkit-transition: var(--transition-length);
		transition: var(--transition-length);
		-webkit-transform: translateX(-13px);
		-ms-transform: translateX(-13px);
		transform: translateX(-13px);
	}

	:global(body.dark) .theme-icon {
		-webkit-transform: translateX(13px);
		-ms-transform: translateX(13px);
		transform: translateX(13px);
		color: var(--dark-txt-primary);
	}

	.dropdown {
		position: relative;
		display: inline-block;
	}

	.dropdown-content {
		display: none;
		position: absolute;
		background-color: #f1f1f1;
		min-width: 160px;
		box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
		z-index: 1;
		border-radius: 7px;
	}

	:global(body.dark) .dropdown-content {
		background-color: var(--dark-bg-primary);
	}

	.dropdown-content a {
		color: black;
		padding: 12px 16px;
		text-decoration: none;
		display: block;
	}

	:global(body.dark) .dropdown-content a {
		color: var(--dark-txt-primary);
	}

	.dropdown-content a:hover {
		color: var(--light-accent);
	}

	.dropdown:hover .dropdown-content {
		display: block;
	}

	/*.dropdown:hover .dropbtn {
		/* background-color: #3e8e41; 
	}*/
</style>
