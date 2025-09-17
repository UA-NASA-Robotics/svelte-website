# Troubleshooting and FAQ

Dev server won’t start

- Ensure Node 18+ is installed
- Remove node_modules and package-lock.json, then npm install
- Run npm run check to see TS/svelte errors

Build fails

- Check svelte.config.js and adapter-node version compatibility
- Validate imports from $lib/images exist and are spelled correctly
- Ensure +page.ts flags are compatible (don’t prerender pages with server actions)

Header image missing

- Place a jpg at static/headerImages/<route>.jpg; for the home page, use home.jpg
- Make sure the file name matches the last path segment

Events page shows error

- Upstream JSON may be unavailable; the UI should show a friendly message
- Verify /api/events endpoint fetches remote JSON and returns it locally

Contact form errors

- Validations require name, email/phone, and message
- CouchDB endpoint may be offline; the action returns a 400 fail with Database Connection Error

How do I add a new page?

- Create src/routes/my-page/+page.svelte
- Optionally add +page.ts with prerender/csr flags
- Update src/components/Sitemap.ts to add a nav link
- Add static/headerImages/my-page.jpg if you want a header background
