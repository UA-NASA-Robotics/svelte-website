# Development setup and onboarding

Prerequisites

- Node.js LTS (>= 18) and npm
- Git access to the repository
- Optional: VS Code with Svelte and TypeScript support

First-time setup

1. Clone the repo
2. Install dependencies: npm install
3. Run the dev server: npm run dev
4. Open http://localhost:5173 (or the port shown) – use -- --open to auto-open

Useful scripts

- npm run dev – Vite dev server with HMR
- npm run build – Production build (SvelteKit + adapter-node)
- npm run preview – Run built app locally
- npm run check – svelte-kit sync + svelte-check
- npm run check:watch – typecheck in watch mode

Daily workflow

- Branch off dev; name feature branches descriptively
- Implement changes, run npm run dev for local testing
- Keep components small and typed; update docs when adding routes/components
- Run npm run check and npm run build before opening a PR
- Open PR into dev; after team testing, leads merge dev->master for deploy

Project layout

- src/routes – SvelteKit routes (+layout.svelte, +page.svelte, +page.ts). See routing-and-components.md
- src/components – Shared UI: Header, Footer, cards, utilities
- src/lib – Images and assets compiled via Vite; import with $lib alias
- static – Public files served as-is (e.g., headerImages, document-files)
- src/routes/api – SvelteKit endpoints (server-side only)
- build – Adapter output after build (ignored in day-to-day dev)

On images

- For page content images: place in src/lib/images and import in components. Example: import img from '$lib/images/pic.jpg'
- Header background images must be placed in static/headerImages; filename must match route slug (e.g., home.jpg, events.jpg)

Environment and secrets

- Avoid hardcoding secrets in source. For local experiments, use environment variables or a .env file if you add one
- Current code uses an embedded Google Maps key in ExpressMap.svelte and basic auth for CouchDB in contact form action; consider moving these to env variables if you secure the backend

Contributing etiquette

- Read CONTRIBUTING.md for branching, commit style, code review, and release process

Upgrading dependencies

When upgrading Svelte/SvelteKit or major tooling:

1. Remove local install artifacts (choose your package manager’s lockfile):
	- Delete node_modules and package-lock.json (or pnpm-lock.yaml / yarn.lock)
2. Run Svelte migration helpers:
	- npx svelte-migrate@latest sveltekit-<target-version>
	- Accept and review proposed changes; commit in a branch
3. Reinstall and typecheck:
	- npm install
	- npm run check
4. Ensure the Node adapter is current (if needed):
	- npm i -D @sveltejs/adapter-node@latest
5. Validate the production build locally:
	- npm run build
	- npm run preview
6. Run E2E tests (if present) and smoke test key routes.
