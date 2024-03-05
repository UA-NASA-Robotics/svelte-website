/*

The routes of the website that should be used for header and footer links

*/

type Route = {
	name: string;
	route: string;
	headerLevel: number;
};

type HeaderLink = {
	name: string;
	imgSrc: string;
	headerLevel: number;
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
		imgSrc: '',
		headerLevel: 1
	},
	{
		name: 'Team',
		imgSrc: '',
		headerLevel: 1,
		subroutes: [
			{
				name: 'Competition',
				route: '/about-competition',
				headerLevel: 1
			},
			{
				name: 'History',
				route: '/our-history',
				headerLevel: 1
			},
			{
				name: 'Officers',
				route: '/officers',
				headerLevel: 1
			}
		]
	},
	{
		name: 'New Members',
		route: '/new-members',
		imgSrc: '',
		headerLevel: 1
	},
	{
		name: 'Sponsors',
		route: '/sponsors',
		imgSrc: '',
		headerLevel: 0
	},
	{
		name: 'Outreach',
		route: '/outreach',
		imgSrc: '',
		headerLevel: 1
	},
	{
		name: 'Contact Us',
		route: '/contact-us',
		imgSrc: '',
		headerLevel: 0
	},
	{
		name: 'Events',
		route: '/events',
		imgSrc: '',
		headerLevel: 0
	}
];

export function getRoutes() {
	return routes;
}
