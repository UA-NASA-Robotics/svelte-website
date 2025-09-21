# Routing and components

SvelteKit routing basics

- Directory-based routing under src/routes
- Add a new page by creating a folder with +page.svelte
- Use +page.ts to set prerender/csr flags; add server actions in +page.server.ts for form handling
- API endpoints live under src/routes/<path>/+server.ts and only run on the server

Global layout

- src/routes/+layout.svelte wraps all pages with Header and Footer and loads global styles (routes/styles.css)

Navigation model

- Header and Footer derive their links from src/components/Sitemap.ts
- To add a new top-level or nested route to navigation, add entries in Sitemap.ts and create the corresponding route folder

Shared components

- Header.svelte – top navigation with theme toggle, dynamic header background (from static/headerImages)
- Footer.svelte – site footer with social links and flattened route links
- SideBySideCard.svelte (+ .css) – layout utility for content
- MarkdownParser.svelte (+ markDown.css) – for rendering markdown content blocks
- ExpressMap.svelte – Google Maps embed used on Events page
- AttendanceViewNav.svelte – attendance UI (if/when used by attendance routes)

Images

- For compiled images, place assets in src/lib/images and import them in components/pages
- For header background images, place files in static/headerImages named after the route (e.g., home.jpg, events.jpg). The Header component selects the appropriate background based on location

Adding a new page (example)

1. Create src/routes/my-page/+page.svelte with your content
2. Optionally add src/routes/my-page/+page.ts with export const prerender = true; export const csr = true;
3. Add a route entry to src/components/Sitemap.ts so links appear in the header/footer
4. Add a header image at static/headerImages/my-page.jpg if you want a page-specific header background

Data-driven components (cards)

Some pages use a simple pattern where an array of objects (e.g., Sponsors, officers, or events) is used to render a repeated card UI.

- Define data near the route or in a small module; keep fields consistent across entries
- Import images from $lib/images and store the resolved path on each object
- Pass the object to a shared Card component or map data inline to markup
- Keep card layout/styling in a dedicated component (e.g., SideBySideCard.svelte) to avoid duplication
