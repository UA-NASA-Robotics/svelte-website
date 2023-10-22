<script>
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="UA Nasa Robotics Homepage" />
</svelte:head>


<section>
	<p><img alt="2016 Award at Competition" src="/src/lib/images/2019-team.jpg"></p>
<h2>Who We Are</h2>
<p>The NASA Robotic Mining Team is a student-led engineering design team that designs and builds an autonomous robot for lunar mining. The robot’s design purpose is to traverse and mine in a simulated lunar environment collecting materials 30 cm beneath the surface. Every May, team members spend a week at NASA’s Kennedy Space Center in Florida, where the robot competes against robots built by approximately 50 other teams from other universities all over the US. The team is also focused strongly on K-12 STEM outreach, especially to underrepresented students.</p>
<h3>New Members</h3>
<p>Are you a University of Akron student? Are you interested in joining our team?
<a href="./new-members">Click here to learn more about joining the team.</a></p>
<h3>Sponsors</h3>
<p>Do you represent a company? Would your company like to sponsor our team?
<a href="./contact-us">Reach out to us here.</a></p>
<h3>Outreach</h3>
<p>Do you work with K-12 students? Would you like the team to present to your group?
<a href="./outreach">See our outreach page here.</a></p>
<p><a href="/src/lib/images/team-with-bot.JPG"><img src="/src/lib/images/team-with-bot.JPG" width="400"/></a></p>
<!-- How high is jacob lmao??-->
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
