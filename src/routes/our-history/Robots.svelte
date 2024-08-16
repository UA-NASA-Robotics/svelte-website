<script lang="ts">
	import pirate from '/src/lib/images/robots/PIRATE.jpg';
	import stacee from '/src/lib/images/robots/STACEE.jpg';
	import christee from '/src/lib/images/robots/CHRISTEE.png';
	import spacee from '/src/lib/images/robots/SPACEE.png';
	import rockee from '/src/lib/images/robots/ROCKEE.jpg';
	import audree from '/src/lib/images/robots/audree.jpg';
	import katee from '/src/lib/images/robots/KATEE.png';
	import daisee from '/src/lib/images/robots/DAISEE.png';
	import brandee from '/src/lib/images/robots/BRANDEE.jpg';

	import logo from '/src/lib/images/logo.png';

	const robotsList = [
		{
			image: pirate,
			name: 'PIRATE',
			acronym: 'Piloted Robotic All Terrain Excavator',
			description:
				"Here is our very first robot, PIRATE, who placed 5th out of 44 teams competing. We've come a long way since then, but you can still see similarities with our recent robots!",
			year: '2010-2011'
		},
		{
			image: logo,
			name: 'STEVE',
			acronym: 'Systematic Technical Extraterrestrial Vehicle for Excavation',
			description:
				'STEVE was our 2012 robot who placed 13th for total regolith mined. It was a great learning experience for the team and we are proud of the work that went into this robot.',
			year: '2011-2012'
		},
		{
			image: stacee,
			name: 'STACEE',
			acronym: 'Systematic Technical Automaton Collecting Extraterrestrial Elements',
			description:
				'In 2013 our robot STACEE placed 10th out of 50 teams. The team also won 3rd place in the slide presentation!',
			year: '2012-2013'
		},
		{
			image: christee,
			acronym:
				'Collecting Humanoid Robotic Interplanetary System for Terrestrial Excavation and Exploration',
			name: 'CHRISTEE',
			description:
				'Christee is our cherished 2015 robot who performed exceedingly well! She is our exemplary robot who joins us in all of our outreach events.',
			year: '2013-2016'
		},
		{
			image: spacee,
			acronym: 'Systematic Piloted Automaton Collecting Extraterrestrial Elements',
			name: 'SPACEE',
			description:
				'Spacee was out 2017 robot that is a derivative of our previous robots with some new innovative features.',
			year: '2016-2017'
		},
		{
			image: rockee,
			acronym: 'Robust Operational Collector Kinematically Excavating Elements',
			name: 'ROCKEE',
			description:
				'Our 2018 robot, ROCKEE, placed 5th out of 44 teams competing! We also won third place for both outreach and our systems engineering paper!',
			year: '2017-2018'
		},
		{
			image: audree,
			acronym: 'Autonomous Drum Rotating Extraterrestrial Excavator',
			name: 'AUDREE',
			description:
				'In 2019 the team placed 2nd out of 46 teams in the NASA competition, with 1st place in outreach and 4th place in systems engineering! Here is our 2019 robot AuDREE.',
			year: '2018-2019'
		},
		{
			image: katee,
			acronym: 'Kinematic Autonomous Terrestrial Excavator for Elements',
			name: 'KATEE',
			description:
				"Failure is not an option, words spoken not only for the work of NASA, but the work of our team. Although we encountered hardships with this robot and couldn't make it into the arena, we are still incredibly proud of the work everyone has contributed and being in the competition. As said by Walt Disney, Around here, however, we don't look backwards for very long. We keep moving forward, opening up new doors and doing new things, because we're curious...and curiosity keeps leading us down new paths.",
			year: '2020-2021'
		},
		{
			image: daisee,
			acronym: 'Dexterous Autonomous Interplanetary System for Excavation and Exploration',
			name: 'DAISEE',
			description:
				'Daisee was the 2022-2023 robot, and we are proud at the innovation and hard work that went into this robot. We are excited to see what the future holds for our team and our robots!',
			year: '2022-2023'
		},
		{
			image: brandee,
			acronym: 'Building Robot Autonomously Navigated to Dig, Elevate, and Erect',
			name: 'BRANDEE',
			description:
				'Brandee was the 2023-2024 robot, and we are proud of the success we had with this robot. She was a 4 wheel front loader design who will continue to support the team as an outreach robot.',
			year: '2023-2024'
		}
	];
</script>

<div class="robotContent">
	{#if robotsList.length <= 0}
		<div class="robotCard"><p>There are no robot biographies at this time.</p></div>
	{:else}
		{#each robotsList as robot, index}
			<div class={index % 2 == 0 ? 'robotCard' : 'robotCard robotCardReverse'}>
				{#if robot.image && robot.image.length > 0}
					<div class="robotImageDiv">
						<img src={robot.image} alt="robot Thumbnail" class="robotImg" />
					</div>
				{:else}
					<!-- No image -->
				{/if}

				<div class="robotText">
					<div class="flex-columns">
						<div class="float-left">
							<h2>{robot.name}</h2>
						</div>
						<div class="float-right">
							<h3>{robot.year}</h3>
						</div>
					</div>
					<hr class="bar" />
					<h3>{robot.acronym}</h3>
					<p>{robot.description}</p>
					<p><a href={'/our-history/' + robot.name}> See more information on {robot.name}</a></p>
				</div>
			</div>
		{/each}
	{/if}
</div>
