---
applyTo: '{src/ui/**/*.ts,tests/ui/**/*.ts,tests/e2e/**/*.ts}'
---

# UI Selector & Locator Strategy

## Priority Order for Locators

Always prioritize Playwright's user-facing, semantic locator methods:

1. `page.getByRole(...)` — preferred for interactive elements (buttons, links, dialogs, checkboxes)
2. `page.getByLabel(...)` — preferred for form controls (inputs, selects, textareas)
3. `page.getByPlaceholder(...)` — when no accessible label is present
4. `page.getByText(...)` — for non-interactive text elements
5. `page.getByTestId(...)` — when semantic locators are unavailable
6. `page.locator('css')` — fallback for complex layout structures

## Forbidden Patterns

- **No XPath:** Never use XPath selectors (`//div[...]` or `xpath=...`).
- **No Fragile CSS Chains:** Avoid long brittle CSS paths like `div > div:nth-child(3) > button`.
- **No Hardcoded Sleep:** Never use `page.waitForTimeout()`; use auto-retrying web-first assertions (`expect(locator).toBeVisible()`).
- **Encapsulate in POM:** Keep locators inside Page Objects or Component Objects, never inline in spec files when a page object exists.
