<script>
import home3 from '$lib/images/home3.jpg';
import welcomeback from '$lib/images/welcome-back.jpg';
</script>

<svelte:head>
	<title>Home</title>
	<meta
		name="description"
		content="UA Nasa Robotic Mining Competition Team, University of Akron Design Team"
	/>
	<meta
		name="keywords"
		content="NASA, Robotic Mining Competition, Lunabotics, Artemis, Moon to Mars, design team"
	/>
	<meta name="author" content="UA NASA Robotic Mining Competition Team" />
</svelte:head>

<section>
	<img alt="2023-2024 Team at Competition" src={home3} width="90%" />
	<h1>Who We Are</h1>
	<p>
		The NASA Robotic Mining Team is a student-led engineering design team that designs and builds an
		autonomous robot for lunar mining. The robot’s design purpose is to traverse and mine in a
		simulated lunar environment collecting materials 30 cm beneath the surface. Every May, team
		members spend a week at NASA’s Kennedy Space Center in Florida, where the robot competes against
		robots built by approximately 50 other teams from other universities all over the US. The team
		is also focused strongly on K-12 STEM outreach, especially to underrepresented students.
	</p>

	<div class="flex-columns">
		<div class="thirds">
			<h3>New Members</h3>
			<p>
				Are you a University of Akron student? Are you interested in joining our team?
				<a href="./new-members">Click here to learn more about joining the team.</a>
			</p>
		</div>
		<div class="thirds">
			<h3>Sponsors</h3>
			<p>
				Do you represent a company? Would your company like to sponsor our team?
				<a href="./contact-us">Reach out to us here.</a>
			</p>
		</div>
		<div class="thirds">
			<h3>Outreach</h3>
			<p>
				Do you work with K-12 students? Would you like the team to present to your group?
				<a href="./outreach">See our outreach page here.</a>
			</p>
		</div>
	</div>

	<img src={welcomeback} width="75%" alt="The team in the design building." />
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
</style>
