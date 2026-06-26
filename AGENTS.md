# CLAUDE Instructions for Playwright + TypeScript (UI + API)

## Goal

You are assisting with automated test development in this repository.
Prioritize:
- Readability
- Maintainability
- Stability (low flaky rate)
- Clear separation of responsibilities

## Tech Stack

- Playwright Test
- TypeScript (strict mode — no `any`, explicit return types for public functions, `readonly` where applicable)
- Node.js
- dotenv for environment variables
- @faker-js/faker for dynamic test data generation
- chalk for structured console output in fixtures/utils
- zod for runtime schema validation in API tests

## Project Structure

```
src/
  api/
    consts/       # API endpoint paths and HTTP status code constants
    models/       # TypeScript interfaces for API request/response shapes
    factories/    # Payload builders using faker (e.g., createUserPayload())
    requests/     # Shared API request helpers (raw APIRequestContext calls)
    steps/        # Multi-step API operations combining multiple requests
  ui/
    pages/        # Page Object classes — one file per page (*.page.ts)
    components/   # Reusable component objects (e.g., modal, navbar)
    models/       # TypeScript interfaces for UI form data
    factories/    # UI form data builders using faker
  fixtures/       # Playwright fixture extensions (*.fixture.ts)
  data/           # Static constants, enums, shared seed values
  utils/          # Generic helpers (formatting, logging, etc.)
tests/
  ui/             # UI spec files (*.spec.ts)
  api/            # API spec files (*.spec.ts)
  e2e/            # End-to-end flow specs (*.spec.ts)
```

Rules:
- `src/` contains reusable code only — no test scenarios.
- `tests/` contains only spec files and scenario-level assertions.
- Static constants and enums → `src/data/`. API endpoint paths and status codes → `src/api/consts/`. Dynamically generated objects → factories.
- Keep selectors out of tests when a Page Object already exists.
- API payload builders → `src/api/factories/`. UI form data builders → `src/ui/factories/`.
- Multi-step API flows (e.g., create + assign + verify) → `src/api/steps/`.

Path Aliases (tsconfig.json):
- `@api/consts/*` → `src/api/consts/*`
- `@api/requests/*` → `src/api/requests/*`
- `@api/factories/*` → `src/api/factories/*`
- `@api/models/*` → `src/api/models/*`
- `@api/steps/*` → `src/api/steps/*`
- `@ui/pages/*` → `src/ui/pages/*`
- `@ui/components/*` → `src/ui/components/*`
- `@ui/models/*` → `src/ui/models/*`
- `@ui/factories/*` → `src/ui/factories/*`
- `@data/*` → `src/data/*`
- `@utils/*` → `src/utils/*`
- `@fixtures/*` → `src/fixtures/*`

## File Naming Conventions

| Type                  | Pattern                    |
|-----------------------|----------------------------|
| Page Object           | `*.page.ts`                |
| Component Object      | `*.component.ts`           |
| Fixture               | `*.fixture.ts`             |
| Spec file             | `*.spec.ts`                |
| Model / interface     | `*.model.ts`               |
| Factory / builder     | `*.factory.ts`             |
| API request helper    | `*.api.request.ts`         |
| API steps             | `*.api.steps.ts`           |
| Constants file        | `*.const.ts`               |

## Test Execution Commands

Prefer npm scripts from package.json:

| Script                  | Purpose                          |
|-------------------------|----------------------------------|
| `npm test`              | Run all tests                    |
| `npm run test:list`     | List discovered tests            |
| `npm run test:ui`       | Run UI tests only                |
| `npm run test:api`      | Run API tests only               |
| `npm run test:e2e`      | Run E2E tests only               |
| `npm run test:all`      | Run all projects (api, ui, e2e)  |
| `npm run test:headed`   | Run in headed mode               |
| `npm run test:debug`    | Run Playwright Inspector mode    |
| `npm run test:report`   | Open HTML report                 |

Use these scripts instead of long raw `playwright test ...` commands.

## UI Testing Rules

- Use Page Object Model for all page-level interactions.
- Keep assertions in tests, not inside Page Objects.
- **Always prefer Playwright's built-in locator methods** in this priority order:
  1. `getByRole` — preferred for interactive elements
  2. `getByLabel` — for form fields
  3. `getByPlaceholder`
  4. `getByText`
  5. `getByTestId`
  6. `locator('css')` — only when no semantic locator applies
- Avoid XPath, brittle CSS chains, and `nth-child` selectors.
- Do not use `waitForTimeout` — use auto-retrying locators and assertions instead.

## Assertions

- **Always prefer web-first (auto-retrying) assertions** from `@playwright/test`:
  - `expect(locator).toBeVisible()`
  - `expect(locator).toHaveText()`
  - `expect(locator).toHaveValue()`
  - `expect(page).toHaveURL()`
  - `expect(locator).toBeEnabled()` / `toBeDisabled()`
  - `expect(locator).toBeChecked()`
- Avoid asserting on `.textContent()`, `.innerText()`, or resolved promise values — these bypass auto-retry.
- Use `expect.soft()` when multiple independent assertions should all run even on failure.
- Add a custom message to assertions when the failure reason may not be obvious: `expect(x, 'should show success banner').toBeVisible()`.

## API Testing Rules

- Do not use Page Objects for API tests.
- Reuse shared request helpers from `src/api/requests/`.
- Validate at minimum: status code, key response body fields, critical headers.
- Keep API setup/teardown fast and deterministic.
- Use `expect(response.status()).toBe(200)` — not `response.ok()` assertions alone.

## E2E Rules

- Keep E2E focused on critical business flows only.
- Prepare test data via API when faster and more reliable than UI setup.
- Each test must be fully independent — no shared mutable state between tests.
- Group related scenarios with `test.describe()`. Tag tests with `@smoke`, `@regression`, etc. where applicable.

## Fixtures and Data

- Use fixtures (`*.fixture.ts`) for reusable setup/teardown and cross-test dependencies.
- Static constants/enums → `src/data/`. Generated objects → factories using `@faker-js/faker`.
- Never hardcode secrets or environment-specific URLs in test files.

## Environment and Security

- Load all environment variables from `.env` via dotenv.
- Never commit `.env` — keep `.env.example` updated when adding new variables.
- On CI, `process.env.CI` is set — retries and worker count are adjusted automatically in `playwright.config.ts`.

## Code Quality

- Strict TypeScript: no `any`, explicit return types on public methods, prefer `readonly` for immutable fields.
- Keep methods short and intention-revealing.
- Reuse existing patterns before introducing new abstractions.
- Do not add new libraries unless clearly justified.

## Copilot Output Expectations

When generating code:
- Match existing architecture, naming conventions, and file structure.
- Prefer minimal, focused diffs.
- Include only meaningful comments.
- Propose tests for any new behavior.
- If changing behavior, note the impacted scope (UI / API / E2E).