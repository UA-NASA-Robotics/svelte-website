<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { getRoutes } from './Sitemap';

	import logo from '$lib/images/Logo.png';

	type Route = {
		name: string;
		route: string;
		headerLevel: number;
		headerHide?: boolean;
		footerHide?: boolean;
	};

	type HeaderLink = {
		name: string;
		imgSrc: string;
		headerLevel: number;
		headerHide?: boolean;
		footerHide?: boolean;
	};

	type HeaderRouteWithoutSubroutes = Route & HeaderLink;

	type HeaderRouteWithSubroutes = HeaderLink & {
		route?: string;
		subroutes: Route[];
	};

	type HeaderRoute = HeaderRouteWithoutSubroutes | HeaderRouteWithSubroutes;

	const routes: HeaderRoute[] = getRoutes();

	//Header Background Img Load
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

	onMount(() => {
		makeLiTextSize(); //set the font size of the nav links
		//At top of sequence to reduce time before link text size is set
		//reduce layout shift

		headerBackgroundImageUpdate();

		const value = localStorage.getItem('theme');

		if (isTheme(value)) {
			theme = value;
		} else {
			theme = Themes.Light;
		}

		updateTheme();
	});

	//Header Background Img Load
	function headerBackgroundImageUpdate() {
		let currentUrl = window.location.href; //split the url at the slashes
		currentUrl = currentUrl.split('?')[0]; //remove any query params
		currentUrl = currentUrl.split('#')[0]; //remove any link refs
		let currentUrllist = currentUrl.split('/'); //split the url at the slashes
		let headerImgLink = currentUrllist[currentUrllist.length - 1]; //get the last item in the array the base page name

		if (headerImgLink == '') {
			//fix / index page
			headerImgLink = 'home';
		}
		let headerImgLinkPath = '/headerImages/' + headerImgLink + '.jpg'; //create the path to the image

		const header = document.querySelector('header'); //get the header element
		if (header) header.style.backgroundImage = 'url(' + headerImgLinkPath + ')'; //set the background image
	}

	onNavigate(() => {
		headerBackgroundImageUpdate();
		//setMenuCollapsed();
	});

	//Hamgurger Menu
	/*let menuExpanded: boolean = false;

	function setMenuCollapsed() {
		if (menuExpanded) {
			let x = document.getElementById('collapser');
			if (x) {
				while (x.className.includes('hidden')) {
					x.className = x.className.replace('hidden', '');
				}
			}
		} else {
			let x = document.getElementById('collapser');
			if (x) {
				x.className += ' hidden';
			}
		}
	}

	function toggleMenu() {
		menuExpanded = !menuExpanded;
		setMenuCollapsed();
	}
*/
	function makeLiTextSize() {
		//Set the text size of the nav links based on the length of the text
		//This is proportional to the nav link ul container, hence cqw
		//This allows the header to dynamically resize to take-up the correct width
		//This is a hacky way to do this, but it works
		//Why can't you just set the width of text and have the hight auto-resize? I don't know
		let RoutesTopLevelLength = routes.length;
		let topLevelTextLength = 0;
		routes.forEach((route) => {
			topLevelTextLength += route.name.length;
		});
		let percent = 100 / ((topLevelTextLength / RoutesTopLevelLength) * 7); //5.8 is the average length of a word in terms of it's height... yeah this is very hacky
		let verticalPercent = percent * 2.4; //this just kinda looks right... I don't know why is this so hard
		document.documentElement.style.setProperty('--nav-page-font-size', percent + 'cqw');
		document.documentElement.style.setProperty(
			'--nav-page-vertical-font-size',
			verticalPercent + 'cqw'
		);
	}
</script>

<header>
	<div class="header-container">
		<div class="header-logo">
			<a href="/">
				<img src={logo} alt="logo" class="logo" />
			</a>
		</div>

		<div class="link-area">
			<div class="header-level-0 link-bar" id="level-0">
				<nav class="topNav">
					<ul class="nav-contents">
						{#each routes as route}
							{#if route.headerLevel !== 0 || route.headerHide === true}
								<!-- Skipped render route on this level-->
							{:else if 'subroutes' in route}
								<li
									aria-current={$page.url.pathname === route.route ||
									route.subroutes.some((sub) => sub.route === $page.url.pathname)
										? 'page'
										: 'false'}
									class="sub-nav-link"
								>
									<a
										href={route.route}
										aria-current={$page.url.pathname === route.route ||
										route.subroutes.some((sub) => sub.route === $page.url.pathname)
											? 'page'
											: 'false'}
										class="sub-nav-link-a"
									>
										{route.name}
									</a>
									<ul class="sub-nav">
										{#each route.subroutes as sub}
											<li
												aria-current={$page.url.pathname === sub.route ? 'page' : 'false'}
												class="nav-page"
											>
												<a
													href={sub.route}
													aria-current={$page.url.pathname === sub.route ? 'page' : 'false'}
												>
													{sub.name}
												</a>
											</li>
										{/each}
									</ul>
								</li>
							{:else}
								<li
									aria-current={$page.url.pathname === route.route ? 'page' : 'false'}
									class="nav-page"
								>
									<a
										href={route.route}
										aria-current={$page.url.pathname === route.route ? 'page' : 'false'}
									>
										{route.name}
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				</nav>
			</div>

			<div class="header-level-1 link-bar" id="level-1">
				<nav class="topNav">
					<ul class="nav-contents">
						{#each routes as route}
							{#if route.headerLevel !== 1 || route.headerHide === true}
								<!-- Skipped render route on this level-->
							{:else if 'subroutes' in route}
								<li
									aria-current={$page.url.pathname === route.route ||
									route.subroutes.some((sub) => sub.route === $page.url.pathname)
										? 'page'
										: 'false'}
									class="sub-nav-link"
								>
									<a
										href={route.route}
										aria-current={$page.url.pathname === route.route ||
										route.subroutes.some((sub) => sub.route === $page.url.pathname)
											? 'page'
											: 'false'}
										class="sub-nav-link-a"
									>
										{route.name}
									</a>
									<ul class="sub-nav">
										{#each route.subroutes as sub}
											<li
												aria-current={$page.url.pathname === sub.route ? 'page' : 'false'}
												class="nav-page"
											>
												<a
													href={sub.route}
													aria-current={$page.url.pathname === sub.route ? 'page' : 'false'}
												>
													{sub.name}
												</a>
											</li>
										{/each}
									</ul>
								</li>
							{:else}
								<li
									aria-current={$page.url.pathname === route.route ? 'page' : 'false'}
									class="nav-page"
								>
									<a
										href={route.route}
										aria-current={$page.url.pathname === route.route ? 'page' : 'false'}
									>
										{route.name}
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				</nav>

				<div class="theme-toggle">
					<label class="switch" aria-label="Dark mode switch">
						<input type="checkbox" on:change={changeTheme} checked={theme === Themes.Dark} name="dark-mode toggle"/>
						<span class="slider round">
							<i
								class={theme === Themes.Light
									? 'theme-icon fa-solid fa-sun'
									: 'theme-icon fa-solid fa-moon'}
							/>
						</span>
					</label>
				</div>
			</div>
		</div>
	</div>
</header>

<style>
	:root {
		--nav-page-font-size: 1cqw;
		--nav-page-vertical-font-size: 1cqh;
		/* ^^^ Set by makeLiTextSize() on page load*/
	}
	header {
		min-height: 10vh;
		height: fit-content; /*auto scale to menu size*/
		transition: all var(--transition-length) linear;

		background-color: var(--light-bg-secondary);
		/*transition: color var(--transition-length) linear;*/
		-webkit-transition: var(--transition-length);
		background-image: '';
		background-size: cover;
		background-repeat: no-repeat;
		background-attachment: fixed;

		background-position: center;
		box-shadow: inset 0 0 0 1000px rgba(25, 44, 139, 0.8);
	}

	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.header-logo {
		padding: 1rem;
		width: 15%;
		max-width: 20vw;
	}

	.logo {
		width: 100%;
	}

	.link-area {
		/*max-width: 80%;
		min-width: 40%;*/
		display: flex;
		flex-direction: column;
		border-radius: 5vh;
	}

	@media screen and (max-width: 1024px) {
		/* Biggest menu possible until 1024px */
		.link-area {
			width: 85%;
		}
	}

	@media screen and (min-width: 1024px) and (max-width: 1440px) {
		/* Medium menu size */
		.link-area {
			width: 75%;
		}
	}

	@media screen and (min-width: 1440px) and (max-width: 2560px) {
		/* Smaller menu size */
		.link-area {
			width: 65%;
		}
		.header-logo {
			width: 10%;
		}
	}

	@media screen and (min-width: 2560px) {
		/* Smallest menu size */
		.link-area {
			width: 55%;
		}
		.header-logo {
			width: 10%;
		}
	}

	.link-bar {
		display: flex;
		width: 100%;
		justify-content: flex-end;
	}
	/*-- Nav --*/

	/* BASE STYLES, work with hidden and shown and horizontal and vertical */
	.topNav {
		/* top level nav item */
		display: flex;
		transition: all var(--transition-length) linear;
		--webkit-transition: var(--transition-length);
		width: 100%;
	}

	.header-level-1 .topNav {
		/* Make room for the theme switch */
		width: 80%;
	}

	.nav-contents {
		/* the top level ul in the nav */
		display: flex;
		flex-direction: row;
		width: 100%;
		padding: 0%;
		container-type: inline-size;
		overflow: hidden;
		justify-content: flex-end;
		transition: all var(--transition-length) linear;
		--webkit-transition: var(--transition-length);
	}

	.nav-page {
		/* li nav page link item. can be top level or under sub-nav ul*/
		list-style-type: none;
		font-family: var(--title-font);
		font-size: var(--nav-page-font-size);
		/*width: 95%;*/
		width: fit-content;
		margin-right: 3%;
		/*margin-bottom: 5%;*/
		display: flex;
		align-self: center;
		border-radius: 2cqw;
		padding: 1cqw;
		text-decoration: none;
		transition: all var(--transition-length) linear;
		--webkit-transition: var(--transition-length);
	}

	.sub-nav {
		/* ul sub-level of nav */
		/*width: 100%;*/
		display: none;
		flex-direction: row;
		padding: 0%;
		width: fit-content;
		transition: all var(--transition-length) linear;
		--webkit-transition: var(--transition-length);
	}

	.sub-nav-link {
		/* li item with a sub-nav ul inside of it*/
		list-style-type: none;
		font-size: var(--nav-page-font-size);
		margin-right: 5%;
		display: flex;
		flex-direction: row;
		/*margin-bottom: 5%;*/
		align-self: center;
		/*width: 95%;*/
		width: fit-content;
		text-decoration: none;
		border-radius: 2cqw;
		transition: all var(--transition-length) linear, padding;
		--webkit-transition: all var(--transition-length), padding: none;
		padding: 1%; /* This padding got pushed on top of a nav-page li padding moving the header around*/
	}

	.sub-nav-link:hover {
		padding: 0%; /* remove padding when hovered */
	}

	.sub-nav-link:hover .sub-nav {
		display: flex;
		width: fit-content;
	}
	.sub-nav-link:hover .sub-nav-link-a {
		display: none;
	}

	.sub-nav-link-a {
		/* a tag inside of a sub-nav-link li */
		text-decoration: none;
		margin-right: 5%;
		align-self: center;
	}

	.nav-page[aria-current='page'] {
		background-color: var(--dark-accent);
	}

	:global(body.dark) .nav-page[aria-current='page'] {
		background-color: var(--ua-dark-blue);
	}

	.sub-nav-link[aria-current='page'] {
		background-color: var(--dark-accent);
	}

	:global(body.dark) .sub-nav-link[aria-current='page'] {
		background-color: var(--ua-dark-blue);
	}
	.sub-nav-link[aria-current='page']:hover {
		background-color: revert;
	}

	:global(body.dark) .sub-nav-link[aria-current='page']:hover {
		background-color: revert;
	}

	a:hover {
		text-decoration: none;
	}

	a {
		color: var(--dark-txt-primary);
	}

	.nav-page[aria-current='false']:hover{
		background-color: var(--ua-dark-grey);
	
	}

	@media screen and (max-width: 600px) {
		.nav-page {
			font-size: var(--nav-page-vertical-font-size);
		}
		.sub-nav-link {
			font-size: var(--nav-page-vertical-font-size);
		}

		.sub-nav-link:hover .sub-nav-link-a {
			display: none;
		}

		.sub-nav-link:hover .sub-nav {
			flex-direction: column;
		}
	}
	/*-- Theme Switch --*/

	.theme-toggle {
		width: 8%; /* THIS is the size of the whole theme switch */
		/*min-width: 30px;*/
		/*max-width: 50px;*/
		align-self: center;
		margin: 1%;
		margin-right: 3%;
		transition: all var(--transition-length) linear;
		--webkit-transition: var(--transition-length);
	}

	@media screen and (max-width: 600px) {
		.theme-toggle {
			width: 15%;
		}
	}

	.switch {
		position: relative;
		display: grid;
		width: 100%;
		height: 100%;
	}

	/* Hide default HTML checkbox */
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.slider {
		/*position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;*/
		background-color: var(--light-bg-primary);
		-webkit-transition: var(--transition-length);
		transition: var(--transition-length);
		display: inline-flex;
		container-type: inline-size;
		height: 100%;
	}

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

	/*input:checked + .slider:before {
		-webkit-transform: translateX(80%);
		-ms-transform: translateX(80%);
		transform: translateX(80%);
	} WHGAT THIS DOOOOOO*/

	/* Rounded sliders */
	.slider.round {
		border-radius: 50dvh;
	}

	.slider.round:before {
		border-radius: 0%;
	} /* WHAT THIS DO?? */

	.theme-icon {
		font-size: 20cqw;
		margin: 10%;
		color: var(--light-txt-primary);
		-webkit-transition: var(--transition-length);
		transition: var(--transition-length);
		-webkit-transform: translateX(-30cqw);
		-ms-transform: translateX(-30cqw);
		transform: translateX(-30cqw);
	}

	/*@media screen and (max-width: 600px) {
		.theme-icon {
			font-size: medium;
		}
	}
	@media screen and (max-width: 400px) {
		.theme-icon {
			font-size: small;
		}
	}*/

	:global(body.dark) .theme-icon {
		-webkit-transform: translateX(30cqw);
		-ms-transform: translateX(30cqw);
		transform: translateX(30cqw);
		color: var(--dark-txt-primary);
	}
</style>
