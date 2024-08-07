<script>
	import ExpressMap from '../../components/ExpressMap.svelte';
	import waterjetcutter from '$lib/images/waterjet-cutter.jpg';
	import jonandeli from '$lib/images/jon-and-eli.jpg';
	import lidar from '$lib/images/lidar.jpg';
</script>

<svelte:head>
	<title>New Members Info</title>
	<meta
		name="description"
		content="Learn more about UA Nasa Robotics team, and what members do daily!"
	/>
	<meta
		name="keywords"
		content="NASA, Robotic Mining Competition, Lunabotics, Artemis, Moon to Mars, member, team, join, people, electrical, mechanical, software, new, express"
	/>
	<meta name="author" content="uA NASA Robotic Mining Competition Team" />
</svelte:head>

<div class="text-column">
	<h2>Welcome to the University of Akron NASA Robotics Team!</h2>
	<p>
		Our team is made up of three sub-teams: mechanical, electrical, and software. You can join
		whichever team matches your interests, regardless of major! The mechanical team focuses on the
		overall physical design, starting with modeling in SolidWorks and ending with machining parts
		and assembling the robot. The electrical team designs all circuit boards in-house using CAD
		software, as well the wiring for the robot. The software team writes all of the code for the
		robot, mainly in C++, with the goal of making the robot run autonomously.
	</p>
	<p>
		We are making an effort for overall design strategy to be a to be a team wide task, as every
		sub-team has their own unique perspective on the robot. Mechanical team members may be the first
		ones working on a robot design, but everyone on the team has a say in the design process. We are
		also making an effort to have more collaboration between the sub-teams, so that everyone has a
		chance to learn about the other sub-teams and how they work together.
	</p>
	<p>
		<em
			>As a member of the team you'll have the opportunity to learn valuable design and hands-on
			skills that are highly desired by employers!</em
		>
	</p>
	<h2>Mechanical</h2>
	<p>
		Every mechanical component on our robot is designed by students on our team. As a member of the
		mechanical team, we will teach you how to use SolidWorks to 3D model components. Once your
		component has been modeled, you will 3D print a prototype or machine the part! You will also be
		a vital part of the assembly and testing of the robot. Here are some of the other skills you
		will learn as a mechanical:
	</p>
	<div class="flex-columns">
		<div class="thirds">
			<ul>
				<li>3D Modeling</li>
				<li>Prototyping</li>
				<li>3D Printing</li>
				<li>System Integration</li>
				<li>Motor Specification</li>
				<li>Machining</li>
				<li>Welding</li>
				<li>Robot Manufacturing and Assembly</li>
			</ul>
		</div>
		<div class="two-thirds" style="align-items: center;">
			<img src={waterjetcutter} width="100%" alt="Mechanical Sub-team Working" />
			<p>BRANDEE's brackets being cut with the collaboration of <a href="/sponsors">WardJet</a>.</p>
		</div>
	</div>

	<h2>Electrical</h2>
	<p>
		As a member of the electrical team, we will teach you how to design and build the entire
		electrical system of the robot, from circuit boards to batteries to meters of wiring! You will
		start by learning how to use our printed circuit board design software. We will guide you
		through the process of designing, laying out, and routing the board. Once the design is
		complete, the board will be ordered, and we will teach you how to solder components and test
		your circuit board! You will also be an integral part of wiring and testing the electrical
		system of the robot. Here are some of skills you can expect to learn through our team:
	</p>
	<div class="flex-columns">
		<div class="two-thirds">
			<img src={jonandeli} width="100%" alt="Electrical Sub-team Working" />
		</div>
		<div class="thirds">
			<ul>
				<li>Schematic Design</li>
				<li>Circuit Board Design</li>
				<li>Understanding of Circuit Components</li>
				<li>Soldering</li>
				<li>Power Management</li>
				<li>Reading Datasheets</li>
				<li>Hardware Interfacing</li>
				<li>Wiring Harness Design and Construction</li>
			</ul>
		</div>
	</div>

	<h2>Software</h2>
	<p>
		The software team is responsible for the "brains" of the robot: all the code that makes it run!
		On the software team, we will teach you how to code in C and C++. Once you have an understanding
		of coding, you will learn how to use C++ to program the microprocessors on our circuit boards
		designed by the electrical team. We will also teach you algorithm design and implementation, as
		we work toward the goal of a fully autonomous robot! Here are some of the skills the software
		team learns:
	</p>
	<div class="flex-columns">
		<div class="thirds">
			<ul>
				<li>Embedded C++ Programming</li>
				<li>Python Programming</li>
				<li>Algorithm Design</li>
				<li>Hardware Interfacing</li>
				<li>Embedded Communication Protocols</li>
				<li>Image Processing</li>
				<li>Programming for Autonomy</li>
			</ul>
		</div>
		<div class="two-thirds">
			<img src={lidar} width="100%" alt="Software Sub-team Working" />
		</div>
	</div>

	<h2>Join Us!</h2>
	<p>
		We are always looking for new members to join our team! If you are interested in joining, please
		reach out to us <a href="/contact-us">here</a> or come to one of our meetings. See our meeting
		schedule
		<a href="/events">here</a>. We look forward to meeting you!
	</p>
	<ExpressMap />
	<p>Most of our meeting take place is the Express Building, which can be found above!</p>
</div>

<style>
	.thirds {
		display: flex;
		justify-content: center;
	}
	.two-thirds {
		display: flex;
		justify-content: center;
	}

	img {
		align-self: center;
	}
</style>
