<script>
	import './SponsorCard.svelte';

	import ua from '$lib/images/sponsors/UniversityofAkron.jpg';
	import clinton from '$lib/images/sponsors/Clinton-Aluminum---logo.jpg';
	import graco from '$lib/images/sponsors/Graco Inc..avif';
	import osgc from '$lib/images/sponsors/osgc.jpg';
	import wardjet from '$lib/images/sponsors/wardjet.jpg';
	import schaeffler from '$lib/images/sponsors/schaeffler.jpg';
	import andersonPower from '$lib/images/sponsors/anderson-power.png';
	import SponsorCard from './SponsorCard.svelte';

	//make sure fix the tier displays when more are added
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
				logo: osgc,
				name: 'Ohio Space Grant Consortium',
				link: 'http://www.osgc.org/',
				description:
					'The Ohio Space Grant Consortium provides funding and resources to the Robotics Mining Team. They provide resources to help areospace and STEM programs in Ohio.'
			},
			{
				logo: schaeffler,
				name: 'Schaeffler',
				link: 'http://www.schaeffler.us/',
				description:
					'Schaeffler is a global automotive and industrial supplier. They provide funding and resources to the Robotics Mining Team as well as other many other University of Akron design teams.'
			},
			{
				logo: clinton,
				name: 'Clinton Aluminum',
				link: 'https://www.clintalum.com/',
				description:
					'Clinton Aluminum is a supplier of aluminum products. They provide the foundational material for the team to build their robot.'
			}
		],
		tierThreeSponsors: [],
		tierTwoSponsors: [
			{
				logo: wardjet,
				name: 'WardJet',
				link: 'http://www.wardjet.com/'
			},
			{
				logo: graco,
				name: 'Graco',
				link: 'http://www.graco.com/'
			}
		],
		tierOneSponsors: [
			{
				logo: andersonPower,
				name: 'Anderson Power Products',
				link: 'http://www.andersonpower.com/'
			}
		]
	};
</script>

<div class="sponsorContentContainer">
	{#if sponsorsList.tierFourSponsors.length === 0 && sponsorsList.tierThreeSponsors.length === 0 && sponsorsList.tierTwoSponsors.length === 0 && sponsorsList.tierOneSponsors.length === 0}
		<h1>No sponsors yet!</h1>
	{/if}
	{#if sponsorsList.tierFourSponsors.length !== 0}
		<h2>Cosmic Sponsors:</h2>
		<SponsorCard sponsorsList={sponsorsList.tierFourSponsors} tier={4} />
	{/if}
	{#if sponsorsList.tierThreeSponsors.length !== 0}
		<div style="height: 5vh;"></div>
		<h2>Interstellar Sponsors:</h2>
		<SponsorCard sponsorsList={sponsorsList.tierThreeSponsors} tier={3} />
	{/if}
	{#if sponsorsList.tierTwoSponsors.length !== 0}
		<div style="height: 5vh;"></div>
		<h2>Lunar Sponsors:</h2>
		<SponsorCard sponsorsList={sponsorsList.tierTwoSponsors} tier={3} />
		<!-- Change tier back to 2, when we get more sponsors-->
	{/if}
	{#if sponsorsList.tierOneSponsors.length !== 0}
		<div style="height: 5vh;"></div>
		<h2>Orbital Sponsors:</h2>
		<SponsorCard sponsorsList={sponsorsList.tierOneSponsors} tier={2} />
	{/if}
</div>
