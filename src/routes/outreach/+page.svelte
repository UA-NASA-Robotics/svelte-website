<script>
	import outreach2 from '$lib/images/outreach2.jpg';
	import outreach3 from '$lib/images/outreach3.jpg';
	import outreachteam from '$lib/images/outreach-team.jpg';
	import jonsoldering from '$lib/images/jon-soldering.jpg';
	import kidscareerday from '$lib/images/kids-careerday.jpg';
	import markerrobots from '$lib/images/markerrobots.jpg';
</script>

<svelte:head>
	<title>Outreach</title>
	<meta
		name="description"
		content="The outreach events of the UA Nasa Robotics Mining Team. Helping and teaching out in the community of Akron"
	/>
	<meta
		name="keywords"
		content="NASA, Robotic Mining Competition, Lunabotics, Artemis, Moon to Mars, outreach, community, events, help, teach, volunteer"
	/>
	<meta name="author" content="uA NASA Robotic Mining Competition Team" />
</svelte:head>

<div class="text-column">
	<p>This year [2023-2024], we helped out with a variety of outreach events, including:</p>
	<ul>
		<li>Make a Difference Day</li>
		<li>Firestone High School VEX VRC Competition</li>
		<li>B-STEM Club Electronics Experiment</li>
		<li>Kids Career Day</li>
	</ul>
	<p>
		To get up to date information about upcoming events goto our <a href="/events">
			upcoming events page.</a
		>
	</p>

	<h3>Make a Difference Day</h3>
	<div class="flex-columns">
		<div class="seconds">
			<p>
				RePlay for kids is an amazing non-profit that repairs electronic toys for children. They
				specialize in making adaptive toys for kids with motor disabilities.
			</p>
		</div>
		<div class="seconds">
			<img src={outreach2} alt="Lane working on a toy car" width="100%" />
		</div>
	</div>
	<div style="height: 100px;" />
	<div class="flex-columns">
		<div class="seconds">
			<img src={outreach3} alt="Team members working on toys." width="100%" />
		</div>
		<div class="seconds">
			<p>
				To help Replay this year, we modified toys to add an easy-to-actuate button into the
				circuit. The button is connected to a 3.5mm audio jack, which is plugged into the toy.
				Replay makes their own buttons by 3d printing the housing and soldering the wires to the
				audio jack. The large button makes it easy for kids with motor disabilities to activate the
				toy. Replay then distributes the toys to kids in need. They have said that the children love
				the independence that comes from being able to play with their toys be themselves!
			</p>
		</div>
	</div>
	<h3>Firestone Vex Robotics Competition</h3>
	<p>
		Vex Robotics is a competition for middle and high school students. The students build robots to
		compete in a game. This year, the game was called Over Under. The robots must score tri-balls
		under a net, as well as climb a structure for end-game.
	</p>
	<h4>Our Roles</h4>
	<div class="flex-columns">
		<div class="seconds">
			<p>
				Our team was split throughout the different roles of the competition. We had a few people
				who were score-keepers, a few who were queue tables, and a few who were judges. Firestone
				High School also let us set up a table to show off our robot and talk to the students about
				our team.
			</p>
		</div>
		<div class="seconds">
			<img src={outreachteam} alt="Group in-front of table" width="100%" />
		</div>
	</div>

	<h3>B-STEM Club Electronics Experiment</h3>
	<div class="flex-columns">
		<div class="seconds">
			<img src={jonsoldering} alt="B-STEM Club" width="100%" />
		</div>
		<div class="seconds">
			<p>
				The B-STEM club is a group of students from in Akron who are interested in STEM. We went to
				their school to help teach them about electronics, and how to solder circuits. We helped
				them put together a simple circuit that they could take home and use.
			</p>
		</div>
	</div>

	<h3>Kids Career Day</h3>
	<div class="flex-columns">
		<div class="seconds">
			<p>
				The team went to a local elementary school to talk to the kids about what we do in
				engineering and robotics. We talked about careers related to engineering, and how they can
				get involved in STEM. We also showed them how to make their own vibratory-movement robots at
				home and trace their paths over paper with markers.
			</p>
		</div>
		<div class="seconds">
			<img src={kidscareerday} alt="Kids with robots" width="100%" />
		</div>
	</div>

	<img src={markerrobots} alt="mark robots on a table." width="100%" />
</div>
