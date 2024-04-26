<script>
	import logo from '$lib/images/Logo.png';

	import './Sponsors.css';

	import ua from '$lib/images/sponsors/UniversityofAkron.jpg';
	import altium from '$lib/images/sponsors/altium.jpg';
	import pepperlFuchs from '$lib/images/sponsors/pepperl-fuchs.jpg';
	import osgc from '$lib/images/sponsors/osgc.jpg';
	import wardjet from '$lib/images/sponsors/wardjet.jpg';
	import schaeffler from '$lib/images/sponsors/schaeffler.jpg';
	import pozyx from '$lib/images/sponsors/pozyx.jpg';
	import andersonPower from '$lib/images/sponsors/anderson-power.png';

	const sponsorsList = [
		{
			logo: ua,
			name: 'University of Akron',
			link: 'http://www.uakron.edu/',
			majorSponsor: true
		},
		{
			logo: altium,
			name: 'Altium',
			link: 'http://www.altium.com/',
			majorSponsor: false
		},
		{
			logo: pepperlFuchs,
			name: 'Pepperl-Fuchs',
			link: 'http://www.pepperl-fuchs.us/',
			majorSponsor: false
		},
		{
			logo: osgc,
			name: 'Ohio Space Grant Consortium',
			link: 'http://www.osgc.org/',
			majorSponsor: true
		},
		{
			logo: wardjet,
			name: 'WardJet',
			link: 'http://www.wardjet.com/',
			majorSponsor: false
		},
		{
			logo: schaeffler,
			name: 'Schaeffler',
			link: 'http://www.schaeffler.us/',
			majorSponsor: false
		},
		{
			logo: pozyx,
			name: 'Pozyx',
			link: 'http://www.pozyx.io/',
			majorSponsor: false
		},
		{
			logo: andersonPower,
			name: 'Anderson Power Products',
			link: 'http://www.andersonpower.com/',
			majorSponsor: true
		}
	];
</script>

<div class="sponsorContent">
	{#if sponsorsList.length <= 0}
		<div class="sponsorCard"><p>There are no sponsors at this time.</p></div>
	{:else}
		{#each sponsorsList as sponsor, index}
			<div
				class={sponsor.majorSponsor
					? 'sponsorCard majorSponsor'
					: index % 2 == 0
					? 'sponsorCard'
					: 'sponsorCard sponsorCardReverse'}
			>
				{#if sponsor.logo != undefined && sponsor.logo != ''}
					<div class={!sponsor.majorSponsor ? 'sponsorImageDiv' : 'sponsorImageDivMajor'}>
						<img src={sponsor.logo} alt="sponsor Thumbnail" class="sponsorImg" />
					</div>
				{:else}
					<div class={!sponsor.majorSponsor ? 'sponsorImageDiv' : 'sponsorImageDivMajor'}>
						<img src={logo} alt="sponsor placeholder" class="sponsorImg" />
					</div>
				{/if}

				<div class={!sponsor.majorSponsor ? 'sponsorText' : 'sponsorTextMajor'}>
					<h2>{sponsor.name}</h2>
					<hr class="bar" />
					<p><a href={sponsor.link}>Visit {sponsor.name}.</a></p>
				</div>
			</div>
		{/each}
	{/if}
</div>
