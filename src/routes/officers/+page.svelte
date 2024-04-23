<script lang="ts">
	import PersonnelBio from '../../components/PersonnelBio.svelte';

	let promise = handleFetchOfficers();

	async function handleFetchOfficers() {
		let response = await fetch('/src/lib/data/admins.json', { method: 'GET' });
		return await response.json();
	}

</script>

<svelte:head>
	<title>Team Leadership</title>
	<meta
		name="description"
		content="The current leadership on the team. See the members leading the UA Nasa Robotics Mining Competition Team."
	/>
	<meta
		name="keywords"
		content="NASA, Robotic Mining Competition, Lunabotics, Artemis, Moon to Mars, team, leadership, president, vice president, project manager, treasurer, officers, leads"
	/>
	<meta name="author" content="UA NASA Robotic Mining Competition Team" />
</svelte:head>

<div class="text-column">
	<div class="left-shift" style="justify-content:left; display:grid;">
		<h1 style="margin:0%">Team Leadership</h1>
	</div>

	<p>
		Our team is led by a group of dedicated students who are passionate about robotics and
		engineering. These students are responsible for the day-to-day operations of the team, as well
		as the long-term planning and strategy. They are also responsible for the team's finances, and
		for ensuring that the team is in compliance with all applicable laws and regulations.
	</p>
	<p>
		The team is structured with a <a href="#president">president</a>,
		<a href="#vice-president">vice president</a>, <a href="#project-manager">project manager</a>,
		<a href="#treasurer">treasurer</a>, and from there is split into three sub-teams: mechanical,
		electrical, and software. Each sub-team has an <a href="#officers">officer</a> and one or more
		<a href="#leads">project leads.</a>
	</p>

	{#await promise}
		<div class="officerCard">
			<p>Loading...</p>
		</div>
	{:then admins}
		<div id="president">
			<!-- President -->
			<h1 class="margin-top-only">President</h1>
			<PersonnelBio Personnel={admins.presidents} />
		</div>
		<div id="vice-president">
			<!-- Vice President -->
			<h1 class="margin-top-only">Vice President</h1>
			<PersonnelBio Personnel={admins.vice_presidents} />
		</div>
		<div id="project-manager">
			<!-- Project Manager -->
			<h1 class="margin-top-only">Project Manager</h1>
			<PersonnelBio Personnel={admins.project_managers} />
		</div>
		<div id="treasurer">
			<!-- Treasurer -->
			<h1 class="margin-top-only">Treasurer</h1>
			<PersonnelBio Personnel={admins.treasurers} />
		</div>
		<div id="officers">
			<!-- Officers -->
			<h1 class="margin-top-only">Sub-team Officers</h1>
			<PersonnelBio Personnel={admins.officers} />
		</div>
		<div id="leads">
			<!-- Leads -->
			<h1 class="margin-top-only">Sub-team Leads</h1>
			<PersonnelBio Personnel={admins.leads} />
		</div>
	{:catch error}
		<div class="officerCard">
			<p>There was an error loading the officers. Please try again later.</p>
			<br /><button on:click={window.location.reload}>Refresh</button>
		</div>
	{/await}
</div>
