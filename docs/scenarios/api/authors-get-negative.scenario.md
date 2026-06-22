# Negative Scenarios — GET /authors

---

# Endpoint Information

- **Method:** GET
- **Endpoint:** /authors
- **Description:** Returns a list of all authors with optional `firstName` / `lastName` filtering.

---

# Preconditions

- API server is running and reachable at `API_URL` from `.env`.
- Authors `Jane Doe` and `John Smith` exist (created via POST /authors in setup) to support filter mismatch scenarios.

---

# Test Data

**Non-matching firstName filter:**
```
firstName=__nonexistent_xyz_12345__
```

**Non-matching lastName filter:**
```
lastName=__nonexistent_xyz_12345__
```

---

# Test Cases

---

## TC-NEG-001

## Scenario
Filter by `firstName` with a value that matches no author returns an empty array

## Purpose
Verify the API returns `200` with `[]` — not a 404 or error — when no author matches the filter. This validates correct "no results" behavior.

## Request

### Headers
```
Accept: application/json
```

### Query Params
```
firstName=__nonexistent_xyz_12345__
```

### Request Body
None

## Expected Status Code
200

## Expected Response
```json
[]
```

## Assertions
- `response.status()` equals `200`
- `Array.isArray(body)` is `true`
- `body.length` equals `0`

---

## TC-NEG-002

## Scenario
Filter by `lastName` with a value that matches no author returns an empty array

## Purpose
Verify the same "no results" behavior for the `lastName` filter.

## Request

### Headers
```
Accept: application/json
```

### Query Params
```
lastName=__nonexistent_xyz_12345__
```

### Request Body
None

## Expected Status Code
200

## Expected Response
```json
[]
```

## Assertions
- `response.status()` equals `200`
- `Array.isArray(body)` is `true`
- `body.length` equals `0`

---

## TC-NEG-003

## Scenario
Filter by both `firstName` and `lastName` where the combination matches no author returns empty array

## Purpose
Verify that combining two filters that together match nothing returns `[]`, not a partial match or an error.

## Request

**Setup:** Author `Jane Doe` exists. Author `John Smith` exists. No author named `Jane Smith` exists.

### Headers
```
Accept: application/json
```

### Query Params
```
firstName=Jane&lastName=Smith
```

### Request Body
None

## Expected Status Code
200

## Expected Response
```json
[]
```

## Assertions
- `response.status()` equals `200`
- `body.length` equals `0`
- No element where `firstName === "Jane"` AND `lastName === "Smith"`

---

## TC-NEG-004

## Scenario
Unknown query parameter does not cause a 500 server error

## Purpose
Verify the API is robust to undocumented query parameters — it should ignore them (200) or reject them cleanly (400), but never return a 500.

## Request

### Headers
```
Accept: application/json
```

### Query Params
```
foo=bar
```

### Request Body
None

## Expected Status Code
200

## Expected Response
Normal authors array (parameter silently ignored).

## Assertions
- `response.status()` is NOT `500`
- `response.status()` equals `200`
- `Array.isArray(body)` is `true`

> Note: The OpenAPI spec does not document a 400 response for unknown query params on GET /authors. Expected behavior is silent ignore → 200. If the server returns 400, update this scenario and document the actual contract behavior.

---

## TC-NEG-005

## Scenario
DELETE on /authors collection (without ID) returns 405

## Purpose
Verify that DELETE /authors (no ID) is rejected — only DELETE /authors/{id} is documented. The collection endpoint only supports GET and POST.

## Request

### Method
DELETE

### Headers
```
Accept: application/json
```

### Path Params
None

### Query Params
None

### Request Body
None

## Expected Status Code
405

## Expected Response
HTTP 405 Method Not Allowed.

## Assertions
- `response.status()` equals `405`
- Response body does not contain an authors array

> Note: The spec does not document an explicit 405 response. This expectation follows HTTP/1.1 standard behavior. If the server returns 404, document as an API ambiguity.

---

## TC-NEG-006

## Scenario
PUT on /authors collection (without ID) returns 405

## Purpose
Verify that PUT /authors (no ID) is rejected — only PUT /authors/{id} is documented.

## Request

### Method
PUT

### Headers
```
Accept: application/json
Content-Type: application/json
```

### Path Params
None

### Query Params
None

### Request Body
```json
{ "firstName": "Test", "lastName": "Author" }
```

## Expected Status Code
405

## Expected Response
HTTP 405 Method Not Allowed.

## Assertions
- `response.status()` equals `405`

---

## TC-NEG-007

## Scenario
Request with unsupported `Accept` header returns 406 or falls back to `application/json`

## Purpose
Verify content negotiation: requesting a response type the server does not produce (e.g., XML) results in 406, not a 500 or a silently ignored mismatch.

## Request

### Headers
```
Accept: application/xml
```

### Query Params
None

### Request Body
None

## Expected Status Code
406

## Expected Response
HTTP error — no XML authors array returned.

## Assertions
- `response.status()` is NOT `500`
- `response.status()` equals `406` (or `200` with `application/json` if server ignores Accept)
- If `200`: `content-type` contains `application/json`, not `application/xml`

> Note: The spec declares response content-type as `*/*` (wildcard), which means the server MAY serve any content type. Establish baseline behavior and document the team decision.

---

## TC-NEG-008

## Scenario
`firstName` filter with an empty string value returns 200 (treated as no filter or empty match)

## Purpose
Verify the API handles an empty string query parameter without errors. Behavior (return all vs. return none) is undocumented — this test establishes the baseline.

## Request

### Headers
```
Accept: application/json
```

### Query Params
```
firstName=
```

### Request Body
None

## Expected Status Code
200

## Expected Response
Array (all authors or empty — behavior to be established).

## Assertions
- `response.status()` is NOT `500`
- `response.status()` equals `200`
- `Array.isArray(body)` is `true`

> Note: Behavior of empty string filter is UNDOCUMENTED in the spec. Run once to establish baseline and document expected result for the team.

---

# Notes

- The OpenAPI spec does NOT document any error responses (400, 401, 403, 404, 405) for GET /authors. All error status code expectations in this file are derived from standard HTTP behavior, not from spec documentation.
- No authentication is documented — no 401/403 scenarios are generated.
- TC-NEG-004 and TC-NEG-008 are baseline-discovery scenarios. Their "expected" result must be confirmed against the actual running API and locked in before adding them to CI regression.
- TC-NEG-005 and TC-NEG-006 (unsupported methods) may return 404 instead of 405 depending on the server framework's routing behavior — document whichever is observed as the correct expected value.
