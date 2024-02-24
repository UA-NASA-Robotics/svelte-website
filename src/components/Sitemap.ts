/*

The routes of the website that should be used for header and footer links

*/

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

const routes: HeaderRoute[] = [
	{
		name: 'Home',
		route: '/',
		imgSrc: ''
	},
	{
		name: 'Team',
		imgSrc: '',
		subroutes: [
			{
				name: 'Competition',
				route: '/about-competition'
			},
			{
				name: 'History',
				route: '/our-history'
			},
			{
				name: 'Officers',
				route: '/officers'
			}
		]
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
		name: 'Contact Us',
		route: '/contact-us',
		imgSrc: ''
	},
	{
		name: 'Events',
		route: '/events',
		imgSrc: ''
	}
];

export function getRoutes() {
	return routes;
}
