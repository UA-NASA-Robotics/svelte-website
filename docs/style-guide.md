# Style guide

General

- TypeScript on by default; keep strict mode happy
- Small, focused components; prefer props over implicit globals
- Keep accessibility in mind: alt text for images, aria attributes for active nav, keyboard-friendly

Files and naming

- Routes use kebab-case directories (e.g., contact-us)
- Components use PascalCase (e.g., Header.svelte, SideBySideCard.svelte)
- Co-locate CSS with components where applicable (e.g., SideBySideCard.css)

CSS and themes

- Use CSS variables defined in global styles for light/dark themes
- Prefer utility classes already present (flex-columns, thirds/seconds, etc.)
- Avoid deeply nested selectors; keep styles local to components when possible

Images and assets

- Prefer importing from $lib/images for processed assets
- Use static/ for files that must be requested by exact paths or are not processed by Vite

Commits and PRs

- Conventional commit style (feat:, fix:, docs:, chore:, refactor:)
- Keep PRs scoped and include a brief test plan
- Update docs when adding routes/components or changing behaviors
