# Testing and QA

End-to-end testing (Playwright)

- Config: playwright.config.ts
  - Spins up the built site with npm run build && npm run preview on port 4173
  - Looks for tests under tests with .test.ts/.spec.ts

How to run

1. Build and preview are handled by Playwright config
2. Use npx playwright test to run tests locally
3. Add tests under tests/ that navigate to the running preview (http://localhost:4173)

Adding a simple smoke test (example)

- Create tests/home.spec.ts that goes to / and asserts the title or main headings exist

Manual QA checklist

- Build succeeds: npm run build
- Preview renders expected pages: npm run preview
- Events page loads and displays events or a friendly empty state
- Contact form validation works and a successful submit shows a confirmation
- Header background images display for known routes
