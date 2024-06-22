import { json } from '@sveltejs/kit';

// This file is used to fetch the events from the server and return them to the client. It is essentially a CORS proxy.
//Read more about it here: https://stackoverflow.com/questions/70472978/sveltekit-proxy-api-to-avoid-cors
export async function GET() {
    let myHeaders = new Headers();
		myHeaders.append('pragma', 'no-cache');
		myHeaders.append('cache-control', 'no-cache');

		var fetchMeta = {
			method: 'GET',
			headers: myHeaders
		};
    const res = await fetch("https://leboeuflasing.ddns.net/uaEvents.json", fetchMeta);
    const eventContent = await res.json();

    return json(eventContent) ;    
}