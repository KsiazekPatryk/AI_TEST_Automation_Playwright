---
applyTo: '{src/api/**/*.ts,tests/api/**/*.ts}'
---

# API Testing Guidelines

## Architecture & Layering

Follow the strict 3-layer architecture for all API interactions:
1. **Layer 1 (Generic):** `src/api/requests/api.request.ts` wrapping `APIRequestContext`.
2. **Layer 2 (Resource):** `src/api/requests/<resource>/<resource>.api.request.ts` using `API_ENDPOINTS` constants.
3. **Layer 3 (Steps):** `src/api/steps/<resource>/<resource>.api.steps.ts` validating status codes, content types, and parsed Zod schemas.

## Test Rules

- **Exact Status Codes:** Always assert exact status codes using constants from `src/api/consts/http.status.codes.const.ts` (e.g. `expect(response.status()).toBe(HTTP_200_OK)`).
- **Content-Type Validation:** Verify `expect(response.headers()['content-type']).toContain('application/json')` for JSON endpoints.
- **Error Response Validation:** In 4xx negative tests, validate both status code and error body structure (e.g., error schema, status, message).
- **No Shared Mutable State:** Seed test resources dynamically via API and clean them up in `afterEach` (mapped by `testInfo.testId`).
- **Factories for Payloads:** Always use factories (`getRandom<Resource>Payload()` or `getRandom<Resource>OverridePayload(overrides)`) instead of inline raw payload objects.
