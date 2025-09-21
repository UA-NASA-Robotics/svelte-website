# UA RMC Robotics Website

This site is built with SvelteKit (adapter-node) and integrates with UA-Events-Bot and CouchDB for basic backend needs.

Quick links to full docs:

- docs/README.md – Index of all developer docs
- docs/development.md – Quickstart and workflow
- docs/architecture.md – Structure and build
- docs/routing-and-components.md – Routes, layouts, components
- docs/data-and-integrations.md – Events proxy, contact form, images
- docs/testing.md – Tests and manual QA
- docs/deployment.md – Releases and server notes
- docs/style-guide.md – Conventions and naming
- docs/troubleshooting.md – Common fixes

## Overview

- Stack: SvelteKit ^2 (Svelte ^5), Vite ^7, TypeScript strict, adapter-node
- Key folders:
	- src/routes — Pages, layouts, and endpoints
	- src/components — Shared UI (Header, Footer, etc.)
	- src/lib — Images/assets compiled by Vite ($lib alias)
	- static — Public files (headerImages, document-files)
	- tests — Playwright tests (if added)

## Quick start

- Install dependencies: npm install
- Start dev server: npm run dev
- Build and preview: npm run build; npm run preview

## Production deploys

Important: pushes to master auto-deploy to production. Work on feature branches off dev and open PRs into dev. Leads merge dev → master when ready to go live.

