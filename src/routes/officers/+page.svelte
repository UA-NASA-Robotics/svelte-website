<script lang="ts">
	import './style.css';
	import PersonnelBio from '../../components/PersonnelBio.svelte';

	let promise = handleFetchOfficers();

	async function handleFetchOfficers() {
		let response = await fetch('/src/lib/data/admins.json', { method: 'GET' });
		return await response.json();
	}
</script>

<svelte:head>
	<title>Team Leadership</title>
	<meta name="description" content="The current leadership on the team." />
</svelte:head>

<div class="text-column">
	<div class="left-shift" style="justify-content:left; display:grid;">
		<h1 style="margin:0%">Team Leadership</h1>
	</div>

	{#await promise}
		<div class="officerCard">
			<p>Loading...</p>
		</div>
	{:then admins}
		<!-- President -->
		<h1 class="margin-top-only">President</h1>
		<PersonnelBio Personnel={admins.presidents} />
		<!-- Project Manager -->
		<h1 class="margin-top-only">Project Manager</h1>
		<PersonnelBio Personnel={admins.project_managers} />
		<!-- Treasurer -->
		<h1 class="margin-top-only">Treasurer</h1>
		<PersonnelBio Personnel={admins.treasurers} />
		<!-- Officers -->
		<h1 class="margin-top-only">Sub-team Officers</h1>
		<PersonnelBio Personnel={admins.officers} />
		<!-- Leads -->
		<h1 class="margin-top-only">Sub-team Leads</h1>
		<PersonnelBio Personnel={admins.leads} />
	{:catch error}
		<div class="officerCard">
			<p>There was an error loading the officers. Please try again later.</p>
			<br /><button on:click={window.location.reload}>Refresh</button>
		</div>
	{/await}
</div>
