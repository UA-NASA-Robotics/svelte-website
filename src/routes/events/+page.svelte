<script lang="ts">
	import { onMount } from 'svelte';

	let events: any;

	async function handleFetchEvents() {
		try {
			let request = new XMLHttpRequest();
			request.open('GET', 'https://corsproxy.io//?https://leboeuflasing.ddns.net/uaEvents.json');
			request.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					// Success!
					events = JSON.parse(this.response);
					console.log(this.response);
				} else {
					// We reached our target server, but it returned an error
					console.log('Connection Loading...');
				}
			};
			request.send();
		} catch (error) {
			alert(error);
			//events = JSON.parse('[]');
		}
	}

	async function DisplayCalender() {
		let calender = document.getElementsByClassName('calender-content')[0];

		calender.innerHTML = '<p> Loading Calender information... </p>';

		let i = 0;
		while (events == null && i < 10) {
			await new Promise((r) => setTimeout(r, 500));
			i++;
		} // Wait for events to be loaded

		if (events == null) {
			calender.innerHTML =
				'<div class="eventCard"><p>There was an error loading the events. Please try again later.</p><br><a href="/events"><button onClick="window.location.reload();">Refresh</button></a></div>';
		} else {
			calender.innerHTML = '';
			for (let i = 0; i < events.length; i++) {
				let event = events[i];
				let eventDiv = document.createElement('div');
				eventDiv.classList.add('eventCard');
				let eventTitle = document.createElement('h2');
				eventTitle.innerText = event.event_name;
				let eventDate = document.createElement('p');
				let date = new Date(parseInt(event.event_date) * 1000);
				eventDate.innerText = date.toDateString() + ' ' + date.toLocaleTimeString();
				let eventLocation = document.createElement('p');
				eventLocation.innerText = event.event_description;
				let eventDescription = document.createElement('p');
				if (event.event_required_attendance == '0') {
					eventDescription.innerText = 'This event is not required for members to attend.';
				} else {
					eventDescription.innerText = 'This event is required for members to attend.';
				}
				eventDiv.appendChild(eventTitle);
				eventDiv.appendChild(eventDate);
				eventDiv.appendChild(eventLocation);
				eventDiv.appendChild(eventDescription);
				calender.appendChild(eventDiv);
			}
		}
		let cssDiv = document.getElementsByClassName('cssdiv')[0];
		let csslink = document.createElement('link');
		csslink.rel = 'stylesheet';
		csslink.href = '/src/routes/events/style.css';
		cssDiv.appendChild(csslink);
	}

	onMount(() => {
		handleFetchEvents();
		DisplayCalender();
	});
</script>

<svelte:head>
	<title>Current Events</title>
	<meta name="description" content="The current events happening for UA Robotics." />
</svelte:head>

<div class="text-column">
	<h1>Upcoming Events</h1>
	<p>
		Here is an live-updated calender of events Akron Lunabotics will be attending. Join us and see
		what our team is like!
	</p>
	<div class="calender-content" />
	<div class="cssdiv" />
</div>
