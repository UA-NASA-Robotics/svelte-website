<script lang="ts">
	import PersonnelBio from './PersonnelBio.svelte';

	import callie from '$lib/images/officers/Callie.png';
	import faith from '$lib/images/officers/Faith.png';
	import brandon from '$lib/images/officers/Brandon.jpg';
	import jon from '$lib/images/officers/Jon.png';
	import jacob from '$lib/images/officers/Jacob.png';
	import lane from '$lib/images/officers/Lane.jpg';
	import james from '$lib/images/officers/James.png';
	import nick from '$lib/images/officers/Nick.png';
	import eli from '$lib/images/officers/Eli.jpg';
	import jonR from '$lib/images/officers/JonR.jpg';
	import jackson from '$lib/images/officers/Jackson.png';
	import nathan from '$lib/images/officers/Nate.png';

	const admins = {
		presidents: [
			{
				name: 'Callie Lewis',
				image: callie,
				team_title: 'President',
				degree: ['Chemical Engineering', 'Spanish'],
				biography:
					"Callie Lewis is the president of the NASA Robotics Team and she is a 4th year Chemical Engineering major with a minor in Spanish. Callie's favorite memory within this club was going to NASA Kennedy Space Center her Freshman year!"
			}
		],
		vice_presidents: [
			{
				name: 'Faith Stewart',
				image: faith,
				team_title: 'Vice President',
				degree: ['Electrical Engineering', 'Classics'],
				biography:
					'Faith Stewart is the Vice President of the NASA Robotics Team and she is a third-year Electrical Engineering major and pursuing a minor in Classical Studies. Faith’s favorite memories within this club include the many of design reviews and being able to connect to the entire team as well as alumni!'
			}
		],
		project_managers: [
			{
				name: 'Brandon McCune',
				image: brandon,
				team_title: 'Project Manager',
				degree: ['Mechanical Engineering', 'Applied Mathematics'],
				biography:
					"Brandon McCune is the Project Manager of the NASA Robotics Team and he is a second-year Mechanical Engineering major with a minor in Mathematics. Brandon's favorite memory within this club was late night talks (somewhat regrettably after midnight sometimes) after a hard day's work. Fun fact about Brandon, he plays piano and was very temporarily in a cover band."
			}
		],
		treasurers: [
			{
				name: 'Jonathan Daus',
				image: jon,
				team_title: 'Treasurer',
				degree: ['Mechanical Engineering'],
				biography:
					'Jonathan Daus is the Treasurer of the NASA Robotics Team and he is a second-year Mechanical Engineering major. Jon’s favorite memory within this club was attending the 2022/2023 NASA Robotics Mining Competition at the University of Alabama!'
			}
		],
		officers: [
			{
				name: 'Jacob Lewis',
				image: jacob,
				team_title: 'Mechanical Officer',
				degree: ['Mechanical Engineering'],
				biography:
					"Jacob Lewis is the Mechanical Officer of the NASA Robotics Team and he is a third-year Mechanical Engineering major. Jacob's favorite memory within this club was leading the Mechanical Team in Alabama at the 2022/2023 NASA Robotics Mining Competition along with that he enjoyed to trip to Florida for the 2021/2022 Competition at NASA Kennedy Space Center!"
			},
			{
				name: 'Lane Cline',
				image: lane,
				team_title: 'Electrical Officer',
				degree: ['Electrical Engineering', 'History'],
				biography:
					'Lane Cline is the Electrical Officer of the NASA Robotics Team and he is a third-year Electrical Engineering major and pursing a minor in history. Lane’s favorite memory within this club was staying up late wiring the robot with the team! Fun fact about Lane, he loves making salsa!'
			},
			{
				name: 'James Nestor',
				image: james,
				team_title: 'Software Officer',
				degree: [
					'Computer Engineering',
					'Applied Mathematics',
					'Computer Science Minor',
					'Physics Minor'
				],
				biography:
					'James Nestor is the Software Officer of the NASA Robotics Team and he is a Computer Engineering and Applied Mathematics double major and pursing a minor in computer science and and physics. James’s favorite memory within this club was being able to work with the entire team and alumni to create the software for BRANDEE!'
			}
		],
		leads: [
			{
				name: 'Nick Seiler',
				image: nick,
				team_title: 'Mechanical Lead',
				degree: ['Mechanical Engineering', 'Mathematics'],
				biography:
					'Nick Seiler is the new Mechanical Lead of the NASA Robotics Team and he is a second-year Mechanical Engineering major and pursing a minor in Mathematics. Nick’s favorite memory within this club was being able to volunteer and be a judge at multiple VEX Robotics Events!🚀'
			},
			{
				name: 'Eli Bukoski',
				image: eli,
				team_title: 'Electrical Lead',
				degree: ['Electrical Engineering', 'Computer Science Minor'],
				biography:
					'Eli Bukoski is the power distribution electrical lead of the NASA Robotics Team and he is a first-year Electrical Engineering major and pursing a minor in Computer Science. Eli’s favorite memory within this club was helping at outreach events with the team, and designing PCBs for the robot! Fun fact about Eli, during high school his team competed in the 2021 Vex Robotics Worlds Competition.'
			},
			{
				name: 'Jonathan Roth',
				image: jonR,
				team_title: 'Electrical Lead',
				degree: ['Electrical Engineering', 'Mathematics Major'],
				biography:
					"Jonathan Roth is the signalling electrical lead of the NASA Robotics Team and he is a first-year Electrical Engineering and Mathematics double major. His favorite memory within this club was anodizing titanium parts for the robot and the unexpected chemistry behind it! Fun fact about Jon, he can solve 22 types of rubik's cubes!"
			},
			{
				name: 'Jackson Stillwagon',
				image: jackson,
				team_title: 'Software Lead',
				degree: ['Electrical Engineering'],
				biography:
					"Jackson Stillwagon is the motor control Software Lead of the NASA Robotics Team and he is a second-year Electrical Engineering major. Jackson's favorite memory within this club was attending Robsgiving this year with the entire Software Team!"
			},
			{
				name: 'Nathan O’Brien',
				image: nathan,
				team_title: 'Software Lead',
				degree: ['Computer Engineering', 'Computer Science'],
				biography:
					'Nathan O’Brien is the communications Software Lead of the NASA Robotics Team and he is a second-year Computer Engineering major and pursing a minor in Computer Science. Nathan’s favorite memory within this club was programming RoboFett to dance and play a Billie Joel song!'
			}
		],
		members: []
	};
</script>

<p>
	The team is structured with a <a href="#president">president</a>,
	<a href="#vice-president">vice president</a>, <a href="#project-manager">project manager</a>,
	<a href="#treasurer">treasurer</a>, and from there is split into three sub-teams: mechanical,
	electrical, and software. Each sub-team has an <a href="#officers">officer</a> and one or more
	<a href="#leads">project leads.</a>
</p>

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
