<script lang="ts">
	import './style.css';

	let promise = handleFetchRobots();

	async function handleFetchRobots() {
		let response = await fetch('/src/lib/data/robots.json', { method: 'GET' });
		return await response.json();
	}
</script>

<svelte:head>
	<title>Our Teams's Robot History</title>
	<meta name="description" content="About our team's past robots." />
</svelte:head>

<div class="text-column">
	<h1>Our Team's Robot History</h1>
	<p>
		The Akron NASA Robotics team has competed every year NASA has hosted the competition. Here are a
		the robots of the Akron RMC team career!
	</p>
	<div class="robotContent">
		{#await promise}
			<p>Loading...</p>
		{:then robots}
			{#if robots.length <= 0}
				<div class="robotCard"><p>There are no robot biographies at this time.</p></div>
			{:else}
				{#each robots as robot, index}
					<div class={index % 2 == 0 ? 'robotCard' : 'robotCard robotCardReverse'}>
						{#if robot.image && robot.image.length > 0}
							<div class="robotImageDiv">
								<img src={robot.image} alt="robot Thumbnail" class="robotImg" />
							</div>
						{:else}
							<!-- No image -->
						{/if}

						<div class="robotText">
							<div class="flex-columns">
								<div class="float-left">
									<h2>{robot.name}</h2>
								</div>
								<div class="float-right">
									<h3>{robot.year}</h3>
								</div>
							</div>
							<hr class="bar" />
							<h3>{robot.acronym}</h3>
							<p>{robot.description}</p>
						</div>
					</div>
				{/each}
			{/if}
		{:catch error}
			<div class="robotCard">
				<p>There was an error loading the robots. Please try again later.</p>
				<br /><button on:click={window.location.reload}>Refresh</button>
			</div>
		{/await}
	</div>
</div>
