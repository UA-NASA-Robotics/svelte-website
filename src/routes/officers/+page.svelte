<script lang="ts">
	import './style.css';

	let promise = handleFetchOfficers();

	async function handleFetchOfficers() {
		let response = await fetch('/src/lib/data/officers.json', { method: 'GET' });
		return await response.json();
	}
</script>

<svelte:head>
	<title>Team Officers</title>
	<meta name="description" content="The current officers on the team." />
</svelte:head>

<div class="text-column">
	<h1>Team Officers</h1>
	<p>Meet the officers of our team!</p>
	<div class="officer-content">
		{#await promise}
			<p>Loading...</p>
		{:then officers}
			{#if officers.length <= 0}
				<div class="officerCard"><p>There are no officer biographies at this time.</p></div>
			{:else}
				{#each officers as officer}
					<div class="officerCard">
						{#if officer.image && officer.image.length > 0}
							<div class="officerImageDiv">
								<img src={officer.image} alt="officer Thumbnail" class="officerImg" />
							</div>
						{:else}
							<!-- No image -->
						{/if}

						<div class="officerText">
							<h2>{officer.name}</h2>
							<hr class="bar" />
							<div class="degreeTokenDiv">
								{#each officer.degree as degree}
									<div class="degreeToken">
										<p class="degreeTokenText">{degree}</p>
									</div>
								{/each}
							</div>
							<h3>{officer.team_title}</h3>
							<p>{officer.biography}</p>
						</div>
					</div>
				{/each}
			{/if}
		{:catch error}
			<div class="officerCard">
				<p>There was an error loading the officers. Please try again later.</p>
				<br /><button on:click={window.location.reload}>Refresh</button>
			</div>
		{/await}
	</div>
</div>
