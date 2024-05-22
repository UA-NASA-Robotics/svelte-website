<script lang="ts">
	import Leadership from './Leadership.svelte';
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
		for ensuring that the team is in compliance with all applicable rules and constraints set by the
		competition.
	</p>
	<Leadership />
</div>
