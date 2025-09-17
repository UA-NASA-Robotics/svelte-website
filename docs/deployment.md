# Deployment

Branching and releases

- Work on feature branches off dev
- Open PRs into dev; team validates and tests the build
- Merging dev into master triggers production deployment (auto-deploy on push to master)

Build artifact

- npm run build produces a Node-adapter output in build/
- Use npm run preview to validate the production bundle locally

Server notes

- Adapter: @sveltejs/adapter-node – deploy as a Node service
- Ensure environment variables and any secrets (if introduced later) are available on the server
- Static files under static/ are served as-is; prerendered HTML exists for pages with prerender true

Pre-deploy checklist

- Bump dependencies only after verifying svelte-check passes and the site builds
- Verify header images exist for new routes under static/headerImages
- Ensure API endpoints (+server.ts) do not accidentally expose secrets; prefer server-only env vars
