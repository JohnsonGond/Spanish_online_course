E2E Tests (Playwright)

How to run
- Install deps: `npm install`
- Install Playwright browsers: `npx playwright install --with-deps`
- Ensure local server is running at `http://localhost:3000` (or set `BASE_URL`)
- Run all tests: `npm run test:e2e`
- UI mode: `npm run test:e2e:ui`

Config
- Base URL: `BASE_URL` env; defaults to `http://localhost:3000`
- Config file: `e2e/playwright.config.mjs`
- Tests directory: `e2e/tests`

What is covered
- Home page links render (four lessons + expressions)
- Lesson 04
  - Pagination and jump menu
  - Quiz feedback for selected answers
  - TTS click mocked via route (no backend required)
- Expressions page
  - Dynamic card rendering
  - TTS click mocked via route

Notes
- Tests mock `POST /api/speak` to avoid 404 in dev and to decouple from Azure creds. Remove the route mocking if you prefer to hit the real backend.
- If your dev server serves pages with `.html` suffixes, the router already handles both `/lesson-04` and `/lesson-04.html`.

