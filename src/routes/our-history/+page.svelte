<script lang="ts">
	import './style.css';

	import Robots from '../../components/Robots.svelte';
</script>

<svelte:head>
	<title>Our Teams's Robot History</title>
	<meta
		name="description"
		content="See the history of the Akron NASA Robotics team's robots. Check out past and current rovers!"
	/>
	<meta
		name="keywords"
		content="NASA, Robotic Mining Competition, Lunabotics, Artemis, Moon to Mars, robot, history, past, current, rovers, competition"
	/>
	<meta name="author" content="UA NASA Robotic Mining Competition Team" />
</svelte:head>

<div class="text-column">
	<h1>Our Team's Robot History</h1>
	<p>
		The Akron NASA Robotics team has competed every year NASA has hosted the competition. Here are a
		the robots of the Akron RMC team career!
	</p>

	<Robots />
</div>
