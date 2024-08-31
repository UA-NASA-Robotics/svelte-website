<script>
	import './SponsorCard.svelte';

	import ua from '$lib/images/sponsors/UniversityofAkron.jpg';
	import altium from '$lib/images/sponsors/altium.jpg';
	import osgc from '$lib/images/sponsors/osgc.jpg';
	import wardjet from '$lib/images/sponsors/wardjet.jpg';
	import schaeffler from '$lib/images/sponsors/schaeffler.jpg';
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
			}
		],
		tierThreeSponsors: [
			{
				logo: osgc,
				name: 'Ohio Space Grant Consortium',
				link: 'http://www.osgc.org/'
			}
		],
		tierTwoSponsors: [
			{
				logo: altium,
				name: 'Altium',
				link: 'http://www.altium.com/'
			},
			{
				logo: wardjet,
				name: 'WardJet',
				link: 'http://www.wardjet.com/'
			}
		],
		tierOneSponsors: [
			{
				logo: schaeffler,
				name: 'Schaeffler',
				link: 'http://www.schaeffler.us/'
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
