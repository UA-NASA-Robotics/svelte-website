<script>
	import cad from '$lib/images/cad.png';
	import buildingbrandee from '$lib/images/building-brandee.jpg';
	import audreepic from '$lib/images/audree-pic.jpg';
	import outreach from '$lib/images/outreach.jpg';
	import competition7 from '$lib/images/2019-competition7.jpg';
</script>

<svelte:head>
	<title>About the Competition</title>
	<meta
		name="description"
		content="About the Nasa RMC competition and UA Nasa Robotics team process."
	/>
	<meta
		name="keywords"
		content="NASA, Robotic Mining Competition, Lunabotics, Artemis, Moon to Mars"
	/>
	<meta name="author" content="uA NASA Robotic Mining Competition Team" />
</svelte:head>

<div class="text-column">
	<h1>What Is Our Competition?</h1>

	<p>
		The NASA Robotic Mining Competition: Lunabotics is a university student design competition based
		on NASA’s Artemis Moon to Mars mission. The goal of this competition is to build a robot that
		can navigate obstacles and excavate icy regolith, or ice chunks, in a simulated lunar
		environment. The competition consists of three phases: Design It, Build It, and Dig It.
	</p>

	<h2>Phase I: Design It</h2>
	<div class="flex-columns">
		<div class="thirds">
			<p>
				In the first phase, we plan for the year and design our robot using 3D modeling CAD
				software. The key deliverables for this phase are the Project Management Plan and the
				Executive Summary.
			</p>
		</div>
		<div class="two-thirds">
			<h3>The Project Management Plan includes:</h3>
			<ul>
				<li>Our schedule for the year</li>
				<li>Our budget for material and travel costs</li>
				<li>
					The parts of our design that we want to optimize, such as autonomy or collection of icy
					regolith
				</li>
				<li>
					<p>
						Technical performance measures that help us manage critical elements of our design, such
						as mass, size, or bandwidth We also write our Executive Summary:
					</p>
				</li>
				<li>
					<p>High-level summary of our project that describes our design and goals</p>
				</li>
				<li>Includes a 3D CAD model of our robot design</li>
			</ul>
			<img src={cad} width="85%" alt="Inventor Screenshot" />
		</div>
	</div>

	<h2>Phase II: Build It</h2>
	<p>
		In Phase II, we actually get to build our robot! This is where much of our hard work is put in,
		from machining parts and assembling the frame, to soldering and wiring, to writing code!
	</p>
	<img src={buildingbrandee} alt="Building the robot." width="40%" />
	<div class="two-thirds" />
	<p>
		Key deliverables for this phase include the Systems Engineering Paper, Slide Presentation, and
		Public Outreach Project Report. We also create a Proof of Life video showing our robot in
		action!
	</p>

	<div class="flex-columns">
		<div class="thirds">
			<h4>Slide Presentation:</h4>
			<p>This is a presentation that we make to the judges while at competition describing:</p>
			<ul>
				<li>Project management</li>
				<li>Safety plan</li>
				<li>Performance goals</li>
				<li>Robot design and testing</li>
				<li>
					Innovation from prior years' designs Proof of Life Video This video shows our robot in
					action performing two digging cycles.
				</li>
			</ul>
			<img src={audreepic} width="85%" alt="Previous Robot Design" />
		</div>
		<div class="thirds">
			<h4>Public Outreach Project Report:</h4>
			<p>
				In this paper, we describe our outreach efforts over the course of the year. For more
				information on our outreach, <a href="/outreach">click here.</a>
			</p>
			<ul>
				<li>What outreach was done</li>
				<li>Who participated</li>
				<li>How it inspired students to learn about STEM</li>
				<li>What demographic was reached</li>
			</ul>
			<p>
				<a href={outreach}
					><img src={outreach} width="85%" alt="Teammates helping at a VRC Competition." /></a
				>
			</p>
		</div>
		<div class="thirds">
			<h4>Systems Engineering Paper</h4>
			<p>
				This paper demonstrates how our team uses the systems engineering process in designing,
				building, and testing our robot. The paper has two main sections:
			</p>
			<ul>
				<li>
					Project Management Merit: This section details design optimization criteria, design
					reviews, work schedule, cost budget, and how our design has changed from the previous
					year.
				</li>
				<li>
					Systems Engineering Merit: This section describes the concept of operations, system
					hierarchy, interfaces, requirements, Technical Performance Measurements, trade studies,
					reliability, and system requirements verification.
				</li>
			</ul>
		</div>
	</div>
	<h3>Phase III: Dig It</h3>
	<p>
		Phase III is the climax of our year of work! Active members of the team get to travel to Kennedy
		Space Center in Florida for a week and compete with 50 universities across the US. In this
		phase, the robot gets two 15-minute competition runs to mine in the arena and excavate as much
		icy regolith simulant (gravel) as possible. Each competition run is scored based on the
		following criteria:
	</p>
	<div class="flex-columns">
		<div class="thirds">
			<ul>
				<li>Safety inspection</li>
				<li>Amount of gravel mined</li>
				<li>Average data bandwidth used</li>
				<li>Camera bandwidth used</li>
				<li>Mining robot mass</li>
				<li>Energy consumed</li>
				<li>Dust tolerant design</li>
				<li>Dust free operation</li>
				<li>Autonomy</li>
			</ul>
		</div>
		<div class="two-thirds">
			<img src={competition7} width="85%" alt="Robot in competition field." />
		</div>
	</div>
</div>

<style>
	img {
		display: block;
		margin-left: auto;
		margin-right: auto;
	}
</style>
