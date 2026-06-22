# Positive Scenarios — GET /authors

---

# Endpoint Information

- **Method:** GET
- **Endpoint:** /authors
- **Description:** Returns a list of all authors. Supports optional filtering by `firstName` and `lastName` query parameters.

---

# Preconditions

- API server is running and reachable at `API_URL` from `.env`.
- Authors used in assertions are created via POST /authors during test setup and deleted via DELETE /authors/{id} in teardown.

---

# Test Data

**Author A — created in setup:**
```json
{ "firstName": "Jane", "lastName": "Doe" }
```
→ capture `id` from POST /authors response

**Author B — created in setup:**
```json
{ "firstName": "John", "lastName": "Smith" }
```
→ capture `id` from POST /authors response

---

# Test Cases

---

## TC-POS-001

## Scenario
GET /authors without query params returns HTTP 200 and an array

## Purpose
Happy path — verify the endpoint responds successfully to a plain request with no filters.

## Request

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
200

## Expected Response
Array of `Author` objects (populated or empty).

## Assertions
- `response.status()` equals `200`
- `Array.isArray(body)` is `true`

---

## TC-POS-002

## Scenario
Author created via POST /authors appears in GET /authors listing

## Purpose
Verify data persistence: a newly created author is immediately visible in the full listing.

## Request

**Setup:** POST /authors `{ "firstName": "Jane", "lastName": "Doe" }` → capture `id`

### Headers
```
Accept: application/json
```

### Query Params
None

### Request Body
None

## Expected Status Code
200

## Expected Response
Array contains an element with:
```json
{ "id": <captured_id>, "firstName": "Jane", "lastName": "Doe" }
```

## Assertions
- `response.status()` equals `200`
- At least one element in array where `element.id === capturedId`
- That element's `firstName` equals `"Jane"`
- That element's `lastName` equals `"Doe"`

---

## TC-POS-003

## Scenario
Filter by `firstName` returns only matching authors

## Purpose
Verify the `firstName` query parameter filters the listing correctly and returns only authors whose first name matches.

## Request

**Setup:** create Author A (`Jane Doe`) and Author B (`John Smith`)

### Headers
```
Accept: application/json
```

### Query Params
```
firstName=Jane
```

### Request Body
None

## Expected Status Code
200

## Expected Response
Array contains Author A and does NOT contain Author B.

## Assertions
- `response.status()` equals `200`
- `Array.isArray(body)` is `true`
- At least one element where `element.firstName === "Jane"`
- No element where `element.firstName === "John"` (assuming Author B is the only John)

---

## TC-POS-004

## Scenario
Filter by `lastName` returns only matching authors

## Purpose
Verify the `lastName` query parameter filters the listing correctly.

## Request

**Setup:** create Author A (`Jane Doe`) and Author B (`John Smith`)

### Headers
```
Accept: application/json
```

### Query Params
```
lastName=Doe
```

### Request Body
None

## Expected Status Code
200

## Expected Response
Array contains Author A and does NOT contain Author B.

## Assertions
- `response.status()` equals `200`
- At least one element where `element.lastName === "Doe"`
- No element where `element.lastName === "Smith"` (assuming Author B is the only Smith)

---

## TC-POS-005

## Scenario
Filter by both `firstName` and `lastName` returns only the exact-matching author

## Purpose
Verify that combining both query parameters narrows the result to authors matching both criteria simultaneously.

## Request

**Setup:** create Author A (`Jane Doe`) and Author B (`Jane Smith`) to ensure `firstName=Jane` alone would return both.

### Headers
```
Accept: application/json
```

### Query Params
```
firstName=Jane&lastName=Doe
```

### Request Body
None

## Expected Status Code
200

## Expected Response
Array contains Author A only — not Author B.

## Assertions
- `response.status()` equals `200`
- At least one element where `element.firstName === "Jane"` AND `element.lastName === "Doe"`
- No element where `element.lastName === "Smith"`

---

## TC-POS-006

## Scenario
Two consecutive GET /authors calls return consistent results (idempotency)

## Purpose
Verify no side effects from read operations — the listing is stable between consecutive requests.

## Request

Two identical requests: `GET /authors` with no query params.

### Headers
```
Accept: application/json
```

### Query Params
None

### Request Body
None

## Expected Status Code
200 (both calls)

## Expected Response
Both responses contain the same set of author IDs.

## Assertions
- Both `response.status()` equal `200`
- `response1.body.length` equals `response2.body.length`
- Every `id` from response 1 is present in response 2

---

## TC-POS-007

## Scenario
Deleted author no longer appears in GET /authors listing

## Purpose
Verify that DELETE /authors/{id} is reflected in the listing — the removed author is not returned after deletion.

## Request

**Setup:**
1. POST /authors `{ "firstName": "ToDelete", "lastName": "Author" }` → capture `id`
2. DELETE /authors/{id} → expect 204

**Then:** GET /authors

### Headers
```
Accept: application/json
```

### Query Params
None

### Request Body
None

## Expected Status Code
200

## Expected Response
Array does NOT contain an element with `id === capturedId`.

## Assertions
- `response.status()` equals `200`
- No element in array where `element.id === capturedId`

---

# Notes

- `firstName` and `lastName` query parameters are documented in the spec as optional strings. The filter behavior (exact match, case-sensitive, partial match) is NOT specified — TC-POS-003 through TC-POS-005 assume exact match and must be baseline-verified before automation.
- POST /authors returns status `201` per spec — capture the `id` from the response body to use in assertions.
- DELETE /authors/{id} returns `204 No Content` per spec — no body to parse.
- TC-POS-007 depends on DELETE /authors/{id} functioning correctly. Failure may originate from DELETE, not GET.
