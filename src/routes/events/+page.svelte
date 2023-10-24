<script lang="ts">
	import { onMount } from 'svelte';
	import './style.css';

	let promise = handleFetchEvents();

	async function handleFetchEvents() {
		const response = await fetch(
			'https://corsproxy.io//?https://leboeuflasing.ddns.net/uaEvents.json',
			{ method: 'GET' }
		);
		return await response.json();
	}
</script>

<svelte:head>
	<title>Current Events</title>
	<meta name="description" content="The current events happening for UA Robotics." />
</svelte:head>

<div class="text-column">
	<h1>Upcoming Events</h1>
	<p>
		Here is an live-updated calender of events Akron Lunabotics will be attending. Join us and see
		what our team is like!
	</p>
	<div class="calender-content">
		{#await promise}
			<p>Loading...</p>
		{:then events}
			{#if events.length <= 0}
				<div class="eventCard"><p>There are no upcoming events at this time.</p></div>
			{:else}
				{#each events as event}
					<div class="eventCard">
						<h2>{event.event_name}</h2>
						<p>
							{new Date(parseInt(event.event_date) * 1000).toDateString()}
							{new Date(parseInt(event.event_date) * 1000).toLocaleTimeString()}
						</p>
						<p>{event.event_location}</p>
						<p>{event.event_description}</p>
						<sub>
							{#if event.event_required}
								<b>This event is required for members to attend.</b>
							{:else}
								This event is not required for members to attend.
							{/if}
						</sub>
					</div>
				{/each}
			{/if}
		{:catch error}
			<div class="eventCard">
				<p>There was an error loading the events. Please try again later.</p>
				<br /><a href="/events"><button on:click={window.location.reload}>Refresh</button></a>
			</div>
		{/await}
	</div>
</div>
