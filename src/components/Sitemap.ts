/*

The routes of the website that should be used for header and footer links

*/

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
	route?: string;
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
		headerLevel: 1,
		headerHide: false,
		footerHide: false
	},
	{
		name: 'Team',
		imgSrc: '',
		headerLevel: 1,
		headerHide: false,
		footerHide: false,
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
				name: 'Leadership',
				route: '/officers',
				headerLevel: 1
			}
		]
	},
	{
		name: 'New Members',
		route: '/new-members',
		imgSrc: '',
		headerLevel: 1,
		headerHide: false,
		footerHide: false
	},
	{
		name: 'Sponsors',
		route: '/sponsors',
		imgSrc: '',
		headerLevel: 0,
		headerHide: false,
		footerHide: false
	},
	{
		name: 'Outreach',
		route: '/outreach',
		imgSrc: '',
		headerLevel: 1,
		headerHide: false,
		footerHide: false
	},
	{
		name: 'Contact Us',
		route: '/contact-us',
		imgSrc: '',
		headerLevel: 0,
		headerHide: false,
		footerHide: false
	},
	{
		name: 'Events',
		route: '/events',
		imgSrc: '',
		headerLevel: 0,
		headerHide: false,
		footerHide: false
	},
	{
		name: 'Documents',
		route: '/documents',
		imgSrc: '',
		headerLevel: 0,
		headerHide: true,
		footerHide: false

	}
];

export function getRoutes() {
	return routes;
}
