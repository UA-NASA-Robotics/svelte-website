<script lang="ts">
	import { getRoutes } from './Sitemap';

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

	let maxLinksColumns = 3; //The maximum number of columns for footer links

	let flattenedRoutes: Route[] = []; //The flattened array of routes- without footerHide routes

	//Flatten the routes array
	routes.forEach((route) => {
		if ('subroutes' in route) {
			route.subroutes.forEach((subroute) => {
				if (!subroute.footerHide) {
					flattenedRoutes.push(subroute);
				}
			});
		} else {
			if (!route.footerHide) {
				flattenedRoutes.push(route);
			}
		}
	});

	let footerLinksPerColumn = Math.ceil(flattenedRoutes.length / maxLinksColumns);

	import facebook from '$lib/images/footer-links/logo-facebook.png';
	import instagram from '$lib/images/footer-links/logo-instagram.png';
	import youtube from '$lib/images/footer-links/logo-youtube.png';
	import twitter from '$lib/images/footer-links/logo-x-twitter.webp';
	import discord from '$lib/images/footer-links/logo-discord.png';

	const socialButtons = [
		//{
		//	url: 'https://discord.gg/WH3zCN3JSd',
		//	imgSrc: discord,
		//	alt: 'Discord'
		//},
		{
			url: 'https://www.instagram.com/uakronrobotics/',
			imgSrc: instagram,
			alt: 'Instagram'
		},
		{
			url: 'https://www.youtube.com/@uanasaroboticsteam',
			imgSrc: youtube,
			alt: 'Youtube'
		},
		{
			url: 'https://www.facebook.com/UANASArobotics/',
			imgSrc: facebook,
			alt: 'Facebook'
		},
		{
			url: 'https://twitter.com/UAkronRobotics',
			imgSrc: twitter,
			alt: 'X (FKA Twitter)'
		}
	];
</script>

<footer>
	<div class="flex-columns" style="width:85%;">
		<div class="match-footer seconds align-left">
			<p style="padding-right: 3%">Social</p>
			<br />
			<div class="img-container" style="display:flex; align-items:left;">
				{#each socialButtons as { url, imgSrc, alt }}
					<a href={url}>
						<img src={imgSrc} {alt} />
					</a>
				{/each}
			</div>
		</div>
		<div class="match-footer seconds" style="display=flex; align-items:flex-start;">
			<p>Pages</p>
			<div class="bar" />
			<div class="flex-columns">
				{#each { length: maxLinksColumns } as _, i}
					<div
						class={maxLinksColumns > 2 ? 'seconds match-footer' : 'thirds match-footer'}
						style="display=:flex; align-items:flex-start;"
					>
						{#each flattenedRoutes.slice(i * footerLinksPerColumn, (i + 1) * footerLinksPerColumn) as route}
							<a href={route.route} class="footer-link">{route.name}</a>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
	<p>© University of Akron NASA RMC Team 2024-2025</p>
</footer>

<style>
	.flex-columns {
		width: 100%;
	}
	.align-left {
		display: flex;
		flex-direction: row;
	}

	.img-container {
		column-gap: 10px;
	}
	@media screen and (max-width: 800px) {
		.align-left {
			flex-direction: column;
		}
	}
	.match-footer {
		background-color: var(--light-bg-secondary);
		border-color: var(--light-bg-secondary);
		font-size: medium;
	}
	:global(body.dark) .match-footer {
		background-color: var(--dark-bg-secondary);
		border-color: var(--dark-bg-secondary);
	}

	@media screen and (max-width: 600px) {
		.match-footer {
			font-size: large;
		}
	}
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
		background-color: var(--light-bg-secondary);
	}

	:global(body.dark) footer {
		background-color: var(--dark-bg-secondary);
	}

	footer a {
		font-weight: bold;
	}

	footer div {
		display: flex;
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

	.bar {
		color: var(--light-txt-secondary);
		background-color: var(--light-txt-secondary);
		height: 2px;
		border-width: 0px;
		width: 80%;
		margin: auto 0;
	}

	:global(body.dark) .bar {
		color: var(--dark-txt-primary);
		background-color: var(--dark-accent);
	}

	.footer-link {
		padding: 1%;
	}

	@media screen and (max-width: 600px) {
		.footer-link {
			padding: 2%;
		}
	}
</style>
