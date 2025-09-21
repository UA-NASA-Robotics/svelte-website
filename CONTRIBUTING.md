# Contributing

Branches

- Create feature branches off dev
- Open PRs into dev; request review from maintainers
- Leads merge dev into master to deploy to production

Commit style

- Use conventional commits: feat:, fix:, docs:, chore:, refactor:, test:

Before you open a PR

- Run npm run check and fix errors
- Ensure npm run build succeeds; optionally run npm run preview to spot regressions
- Update docs in docs/ if you change architecture, routes, components, or workflows

Code style

- Prefer small, typed components
- Keep accessibility in mind (aria-current, alt text, focus states)
- Use $lib/images for Vite-processed images; static/ for public immutable files

Security and privacy

- Do not commit secrets. If you introduce env-based config, document variables and usage
- Do not store sensitive PII in CouchDB via the contact form
