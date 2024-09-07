<script lang="ts">
	import PersonnelBio from './PersonnelBio.svelte';

	import callie from '$lib/images/officers/Callie.png';
	import faith from '$lib/images/officers/Faith.png';
	import brandon from '$lib/images/officers/Brandon.jpg';
	import jon from '$lib/images/officers/Jon.png';
	import lane from '$lib/images/officers/Lane.jpg';
	import nick from '$lib/images/officers/Nick.png';
	import eli from '$lib/images/officers/Eli.jpg';
	import jonR from '$lib/images/officers/JonR.jpg';
	import jackson from '$lib/images/officers/Jackson.png';
	import nathan from '$lib/images/officers/Nate.png';
	import ayden from '$lib/images/officers/Ayden.jpg';

	const admins = {
		presidents: [
			{
				name: 'Callie Lewis',
				image: callie,
				team_title: 'President',
				degree: ['Chemical Engineering', 'Spanish'],
				biography:
					"Callie Lewis is the president of the NASA Robotics Team and she is a senior Chemical Engineering major with a minor in Spanish. Callie's favorite memory within this club was going to NASA Kennedy Space Center her Freshman year!"
			}
		],
		vice_presidents: [
			{
				name: 'Faith Stewart',
				image: faith,
				team_title: 'Vice President',
				degree: ['Electrical Engineering', 'Classics'],
				biography:
					'Faith Stewart is the Vice President of the NASA Robotics Team and she is a fourth-year Electrical Engineering major and pursuing a minor in Classical Studies. Faith’s favorite memories within this club include the many of design reviews and being able to connect to the entire team as well as alumni!'
			}
		],
		project_managers: [
			{
				name: 'Brandon McCune',
				image: brandon,
				team_title: 'Project Manager',
				degree: ['Mechanical Engineering', 'Applied Mathematics'],
				biography:
					"Brandon McCune is the Project Manager of the NASA Robotics Team and he is a third-year Mechanical Engineering major with a minor in Mathematics. Brandon's favorite memory within this club was watching BRANDEE get out of the crater, and hearing team positivity throughout the competition.  Fun fact about Brandon, he used to do lots of origami crafts, and can make a variety of cool things from notecards.."
			},
			{
				name: 'Ayden Randall',
				image: ayden,
				team_title: 'Assistant Project Manager',
				degree: ['Computer Engineering'],
				biography:
					"Ayden Randall is the Assistant Project Manager of the NASA Robotics Team and he is a second-year Computer Engineering major. Ayden's favorite memory within this club was being able to work with the entire team and alumni to create the software for BRANDEE!"
			}
		],
		treasurers: [
			{
				name: 'Jonathan Daus',
				image: jon,
				team_title: 'Treasurer',
				degree: ['Mechanical Engineering'],
				biography:
					'Jonathan Daus is the Treasurer of the NASA Robotics Team and he is a third-year Mechanical Engineering major. Jon’s favorite memory within this club was attending the 2022/2023 NASA Robotics Mining Competition at the University of Alabama!'
			},
			{
				name: 'Garren Ward',
				image: undefined,
				team_title: 'Marketing Lead',
				degree: ['Electrical Engineering'],
				biography:
					"Garren Ward is the Marketing Lead of the NASA Robotics Team and he is a second-year Electrical Engineering major. Garren's focus on the team is helping with outreach of the team. A large portion of the team is funded by generous donations from our sponsors and Garren helps to ensure that the team is able to continue to grow and compete in the future!"
			}
		],
		managers: [
			{
				name: 'Nick Seiler',
				image: nick,
				team_title: 'Mechanical Manager',
				degree: ['Mechanical Engineering', 'Mathematics'],
				biography:
					'Nick Seiler is the new Mechanical Manager of the NASA Robotics Team and he is a third-year Mechanical Engineering major and is pursing a minor in Mathematics. Nick’s favorite memory within this club was being able to volunteer and be a judge at multiple VEX Robotics Events!'
			},
			{
				name: 'Lane Cline',
				image: lane,
				team_title: 'Electrical Manager',
				degree: ['Electrical Engineering', 'History'],
				biography:
					'Lane Cline is the Electrical Manager of the NASA Robotics Team and he is a fourth-year Electrical Engineering major and pursing a minor in history. Lane’s favorite memory within this club was staying up late wiring the robot with the team. Fun fact about Lane, he loves making salsa!'
			},
			{
				name: 'Jackson Stillwagon',
				image: jackson,
				team_title: 'Software Co-Manager',
				degree: ['Electrical Engineering'],
				biography:
					"Jackson Stillwagon is a Software Co-Manager of the NASA Robotics Team and he is a third-year Electrical Engineering major. Jackson's favorite memory within this club was attending Robsgiving this year with the entire Software Team! Fun fact, Jackson is a general class HAM operator with the call-sign KE8ZMO."
			},
			{
				name: 'Nathan O’Brien',
				image: nathan,
				team_title: 'Software Co-Manager',
				degree: ['Computer Engineering', 'Computer Science'],
				biography:
					'Nathan O’Brien is a Software Co-Manager of the NASA Robotics Team and he is a third-year Computer Engineering major and pursing a minor in Computer Science. Nathan’s favorite memory within this club was programming RoboFett to dance and play a Billie Joel song!'
			}
		],
		leads: [
			{
				name: 'Eli Bukoski',
				image: eli,
				team_title: 'Electrical Lead',
				degree: ['Electrical Engineering', 'Computer Science'],
				biography:
					'Eli Bukoski is the power distribution electrical lead of the NASA Robotics Team and he is a second-year Electrical Engineering major and pursing a minor in Computer Science. Eli’s favorite memory within this club was competing in Lunabotics at Kennedy Space Center! Fun fact about Eli, during high school his team competed in the 2021 Vex Robotics Worlds Competition.'
			},
			{
				name: 'Jonathan Roth',
				image: jonR,
				team_title: 'Software Lead',
				degree: ['Electrical Engineering', 'Mathematics'],
				biography:
					"Jonathan Roth is the communications software lead of the NASA Robotics Team and he is a second-year Electrical Engineering and Mathematics double major. His favorite memory within this club was anodizing titanium parts for the robot and the unexpected chemistry behind it! Fun fact about Jon, he can solve 22 types of rubik's cubes!"
			}
		],
		members: []
	};
</script>

<p>
	The team is structured with a <a href="#president">president</a>,
	<a href="#vice-president">vice president</a>, <a href="#project-manager">project manager</a>,
	<a href="#treasurer">treasurer</a>, and from there is split into three sub-teams: mechanical,
	electrical, and software. Each sub-team has a <a href="#manager">manager</a> and one or more
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
<div id="manager">
	<!-- Officers -->
	<h1 class="margin-top-only">Sub-team Managers</h1>
	<PersonnelBio Personnel={admins.managers} />
</div>
<div id="leads">
	<!-- Leads -->
	<h1 class="margin-top-only">Sub-team Leads</h1>
	<PersonnelBio Personnel={admins.leads} />
</div>
