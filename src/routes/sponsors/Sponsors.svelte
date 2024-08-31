<script>
	import './SponsorCard.svelte';

	import ua from '$lib/images/sponsors/UniversityofAkron.jpg';
	import altium from '$lib/images/sponsors/altium.jpg';
	import pepperlFuchs from '$lib/images/sponsors/pepperl-fuchs.jpg';
	import osgc from '$lib/images/sponsors/osgc.jpg';
	import wardjet from '$lib/images/sponsors/wardjet.jpg';
	import schaeffler from '$lib/images/sponsors/schaeffler.jpg';
	import pozyx from '$lib/images/sponsors/pozyx.jpg';
	import andersonPower from '$lib/images/sponsors/anderson-power.png';
	import SponsorCard from './SponsorCard.svelte';

	const sponsorsList = {
		tierFourSponsors: [
			{
				logo: ua,
				name: 'University of Akron',
				link: 'http://www.uakron.edu/',
				description:
					'The University of Akron provides funding and resources to the Robotics Mining Team. It is the home of the team!'
			},
			{
				logo: ua,
				name: 'University of Akron',
				link: 'http://www.uakron.edu/',
				description:
					'The University of Akron provides funding and resources to the Robotics Mining Team. It is the home of the team!'
			},
			{
				logo: ua,
				name: 'University of Akron',
				link: 'http://www.uakron.edu/',
				description:
					'The University of Akron provides funding and resources to the Robotics Mining Team. It is the home of the team!'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/',
				description:
					'Anderson Power Products is a leader in developing high quality, low cost, power interconnect solutions for industries that require high levels of reliability and performance.'
			},
			{
				logo: osgc,
				name: 'Ohio Space Grant Consortium',
				link: 'http://www.osgc.org/',
				description:
					'The Ohio Space Grant Consortium is a part of the National Space Grant College and Fellowship Program. It is dedicated to funding students and faculty in STEM fields.'
			},
			{
				logo: wardjet,
				name: 'WardJet',
				link: 'http://www.wardjet.com/',
				description:
					'WardJet is an industry leader in waterjet cutting technology. They provide the team with resources and support to help us succeed.'
			}
		],
		tierThreeSponsors: [
			{
				logo: osgc,
				name: 'Ohio Space Grant Consortium',
				link: 'http://www.osgc.org/'
			},
			{
				logo: osgc,
				name: 'Ohio Space Grant Consortium',
				link: 'http://www.osgc.org/'
			},
			{
				logo: osgc,
				name: 'Ohio Space Grant Consortium',
				link: 'http://www.osgc.org/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			},
			{
				logo: wardjet,
				name: 'WardJet',
				link: 'http://www.wardjet.com/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			},
			{
				logo: pepperlFuchs,
				name: 'Pepperl-Fuchs',
				link: 'http://www.pepperl-fuchs.us/'
			}
		],
		tierTwoSponsors: [
			{
				logo: altium,
				name: 'Altium',
				link: 'http://www.altium.com/'
			},
			{
				logo: altium,
				name: 'Altium',
				link: 'http://www.altium.com/'
			},
			{
				logo: altium,
				name: 'Altium',
				link: 'http://www.altium.com/'
			},
			{
				logo: altium,
				name: 'Altium',
				link: 'http://www.altium.com/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			},
			{
				logo: osgc,
				name: 'Ohio Space Grant Consortium',
				link: 'http://www.osgc.org/'
			},
			{
				logo: wardjet,
				name: 'WardJet',
				link: 'http://www.wardjet.com/'
			},
			{
				logo: pepperlFuchs,
				name: 'Pepperl-Fuchs',
				link: 'http://www.pepperl-fuchs.us/'
			}
		],
		tierOneSponsors: [
			{
				logo: pepperlFuchs,
				name: 'Pepperl-Fuchs',
				link: 'http://www.pepperl-fuchs.us/'
			},
			{
				logo: wardjet,
				name: 'WardJet',
				link: 'http://www.wardjet.com/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			},
			{
				logo: osgc,
				name: 'Ohio Space Grant Consortium',
				link: 'http://www.osgc.org/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			},
			{
				logo: pepperlFuchs,
				name: 'Pepperl-Fuchs',
				link: 'http://www.pepperl-fuchs.us/'
			},
			{
				logo: wardjet,
				name: 'WardJet',
				link: 'http://www.wardjet.com/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			},
			{
				logo: osgc,
				name: 'Ohio Space Grant Consortium',
				link: 'http://www.osgc.org/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			},
			{
				logo: pepperlFuchs,
				name: 'Pepperl-Fuchs',
				link: 'http://www.pepperl-fuchs.us/'
			},
			{
				logo: wardjet,
				name: 'WardJet',
				link: 'http://www.wardjet.com/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			},
			{
				logo: osgc,
				name: 'Ohio Space Grant Consortium',
				link: 'http://www.osgc.org/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			},
			{
				logo: pepperlFuchs,
				name: 'Pepperl-Fuchs',
				link: 'http://www.pepperl-fuchs.us/'
			},
			{
				logo: wardjet,
				name: 'WardJet',
				link: 'http://www.wardjet.com/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			},
			{
				logo: osgc,
				name: 'Ohio Space Grant Consortium',
				link: 'http://www.osgc.org/'
			},
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			}
		]
	};
</script>

<div class="sponsorContentContainer">
	<SponsorCard sponsorsList={sponsorsList.tierFourSponsors} tier={4} />
	<div style="height: 5vh;"></div>
	<SponsorCard sponsorsList={sponsorsList.tierThreeSponsors} tier={3} />
	<div style="height: 5vh;"></div>
	<SponsorCard sponsorsList={sponsorsList.tierTwoSponsors} tier={2} />
	<div style="height: 5vh;"></div>
	<SponsorCard sponsorsList={sponsorsList.tierOneSponsors} tier={1} />
</div>
