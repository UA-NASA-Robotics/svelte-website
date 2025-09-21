# Data and integrations

Events feed

- The Events page (src/routes/events/+page.svelte) fetches /api/events on mount
- The endpoint at src/routes/api/events/+server.ts proxies a JSON feed from https://leboeuflasing.com/uaEvents.json and returns it to the client to avoid CORS
- The page renders a list of upcoming events with optional images, times, and flags

Contact form and CouchDB

- Contact form lives at src/routes/contact-us/+page.svelte and posts to the action contact_submission
- The server action is in src/routes/contact-us/+page.server.js; it validates name/email/message and uses Database.append to store a document in CouchDB
- Database.ts implements simple basic-auth GET/POST to CouchDB at leboeuflasing.ddns.net:5984
- Notes:
  - This path is currently hard-coded; consider moving to config/env
  - Data is not sensitive; do not store PII; spam protection is minimal
  - EventsBot integrates with CouchDB and Discord server outside this repository (informational dependency)

Image handling

- src/lib/images contains authored images compiled by Vite; import them: import img from '$lib/images/foo.jpg'
- static/document-files contains PDFs that are served as-is and embedded/downloaded in the Documents page
- static/headerImages contains header background images selected by Header.svelte based on the current route
- A helper script src/lib/images/0ImgResize.py uses Pillow to resize/compress large images; see README for details

Environment variables and configuration

- Currently, no .env is used; you may introduce environment variables via Vite/SvelteKit conventions if moving secrets out of source
- For server-only config, prefer reading environment variables in +server.ts/+page.server.ts
