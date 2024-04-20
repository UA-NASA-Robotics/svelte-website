<script lang="ts">
	import './style.css';

	let promise = handleFetchSponsors();

	async function handleFetchSponsors() {
		let response = await fetch('/src/lib/data/sponsors.json', { method: 'GET' });
		return await response.json();
	}
</script>

<svelte:head>
	<title>Team Sponsors</title>
	<meta
		name="description"
		content="The sponsors of the UA NASA Robotics Mining Competition Team."
	/>
	<meta
		name="keywords"
		content="NASA, Robotic Mining Competition, Lunabotics, Artemis, Moon to Mars, sponsors, funding, contact, support, help"
	/>
	<meta name="author" content="UA NASA Robotic Mining Competition Team" />
</svelte:head>

<div class="text-column">
	<h1>Team Sponsors</h1>

	<div class="sponsorContent">
		{#await promise}
			<p>Loading...</p>
		{:then sponsors}
			{#if sponsors.length <= 0}
				<div class="sponsorCard"><p>There are no sponsor biographies at this time.</p></div>
			{:else}
				{#each sponsors as sponsor, index}
					<div
						class={sponsor.majorSponsor
							? 'sponsorCard majorSponsor'
							: index % 2 == 0
							? 'sponsorCard'
							: 'sponsorCard sponsorCardReverse'}
					>
						{#if sponsor.logo && sponsor.logo.length > 0}
							<div class={!sponsor.majorSponsor ? 'sponsorImageDiv' : 'sponsorImageDivMajor'}>
								<img src={sponsor.logo} alt="sponsor Thumbnail" class="sponsorImg" />
							</div>
						{:else}
							<!-- No image -->
						{/if}

						<div class={!sponsor.majorSponsor ? 'sponsorText' : 'sponsorTextMajor'}>
							<h2>{sponsor.name}</h2>
							<hr class="bar" />
							<p><a href={sponsor.link}>Visit {sponsor.name}.</a></p>
						</div>
					</div>
				{/each}
			{/if}
		{:catch error}
			<div class="sponsorCard">
				<p>There was an error loading the sponsors. Please try again later.</p>
				<br /><button on:click={window.location.reload}>Refresh</button>
			</div>
		{/await}
	</div>

	<p>
		We would like to thank our sponsors for their generous support of our team. Without their help,
		we would not be able to compete in the NASA Robotic Mining Competition. We are grateful for
		their support and look forward to continuing our relationship with them.
	</p>

	<h2>Our Team's Accomplishments</h2>
	<p>
		The NASA Robotics Team allows University of Akron students to gain real-world experiential
		learning opportunities. Our team members are immersed in a work environment similar to the
		engineering industry, where they are challenged to incorporate their classroom knowledge into
		effective designs related to industry. These students benefit from competing with other
		universities from across the country and around the world. This allows the students to gain a
		real-world engineering education by designing, building and testing our prototypes based on
		particular specifications to ensure successful on-site event operations and promote critical
		problem solving. The skills our team members learn from these hands-on experiences cannot be
		taught in the classroom alone. Our students are then able to apply the skills discovered through
		research and hands-on training to their future engineering careers.
	</p>
	<h2>Sponsorship Opportunities</h2>
	<p>
		We respectfully ask you to consider sponsoring our team. Our sponsors will receive high
		visibility through association with our team, recognized for our success in national
		competitions. Our team members are some of the most sought after engineers by industry because
		of the knowledge gained by participating on a design team, and sponsorship is a great
		recruitment tool to attract the next generation of engineers to your company.
	</p>
	<p>
		Thank you for your consideration to learn more about the NASA Robotics Team and interest to help
		drive our success.
	</p>
	<p>
		<a href="/our-history">Click here</a> to read some of our team's accomplishments! For more
		information, please contact us <a href="contact-us">here.</a>
	</p>
</div>
