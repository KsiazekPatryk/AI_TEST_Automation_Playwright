# Schema Validation — GET /authors

---

# Endpoint Information

- **Method:** GET
- **Endpoint:** /authors
- **Description:** Returns a list of all authors. Supports optional filtering by `firstName` and `lastName` query parameters.

---

# Preconditions

- API server is running and reachable at `API_URL` from `.env`.
- At least one author record exists to validate non-empty array structure.

---

# Test Data

No request body (GET). Query params are optional strings. Auth is not documented.

---

# Test Cases

---

## TC-SCHEMA-001

## Scenario
Successful response returns HTTP 200 with content-type containing `application/json`

## Purpose
Verify the correct status code and content-type header are returned on a plain GET /authors request.

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
- `Content-Type` header contains `application/json`
- Body is parseable as valid JSON

## Assertions
- `response.status()` equals `200`
- `response.headers()['content-type']` contains `application/json`
- `response.json()` does not throw

---

## TC-SCHEMA-002

## Scenario
Response body is a JSON array

## Purpose
Verify the top-level structure of the response matches the OpenAPI spec: `array` of `Author` objects.

## Request

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
Root value is a JSON array (`[]` or populated).

## Assertions
- `Array.isArray(body)` is `true`
- Body is not `null`, not an object, not a string

---

## TC-SCHEMA-003

## Scenario
Each author object contains only the documented fields: `id`, `firstName`, `lastName`

## Purpose
Verify no extra undocumented fields appear in author objects (guards against unintended data exposure). The `Author` schema declares only `id`, `firstName`, `lastName`.

## Request

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
Each element has only the keys: `id`, `firstName`, `lastName` (some may be absent since no `required` array is declared).

## Assertions
- For each element: `Object.keys(element)` contains no keys outside `['id', 'firstName', 'lastName']`

---

## TC-SCHEMA-004

## Scenario
`id` field is of type integer (int64)

## Purpose
Verify the `id` field matches the `integer / int64` type declared in the `Author` schema.

## Request

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
Each element with an `id` field has an integer value.

## Assertions
- For each element where `element.id` is present: `Number.isInteger(element.id)` is `true`
- `element.id` is not a string, boolean, or object

---

## TC-SCHEMA-005

## Scenario
`firstName` field is of type string when present

## Purpose
Verify the `firstName` field matches the `string` type declared in the `Author` schema.

## Request

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
Each element where `firstName` is present has a string value.

## Assertions
- For each element where `element.firstName !== undefined`: `typeof element.firstName === 'string'` is `true`

---

## TC-SCHEMA-006

## Scenario
`lastName` field is of type string when present

## Purpose
Verify the `lastName` field matches the `string` type declared in the `Author` schema.

## Request

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
Each element where `lastName` is present has a string value.

## Assertions
- For each element where `element.lastName !== undefined`: `typeof element.lastName === 'string'` is `true`

---

## TC-SCHEMA-007

## Scenario
Response with `?firstName=<value>` returns an array (schema unchanged by query param)

## Purpose
Verify that filtering via query param does not change the response schema — it still returns an array of `Author` objects.

## Request

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
Array (possibly empty) of `Author` objects.

## Assertions
- `response.status()` equals `200`
- `Array.isArray(body)` is `true`
- Each element in array (if any) matches `Author` schema: `id` integer, `firstName` string, `lastName` string

---

## TC-SCHEMA-008

## Scenario
Empty array is a valid schema-compliant response

## Purpose
Verify that when no authors match the filter (or no authors exist), the response is `[]` — not `null`, not an object.

## Request

### Headers
```
Accept: application/json
```

### Query Params
```
firstName=__nonexistent_name_xyz__
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

# Notes

- The `Author` schema does NOT declare a `required` array — all fields (`id`, `firstName`, `lastName`) are technically optional per spec. Automation agents must handle absent fields.
- The schema does not declare `nullable: true` on any field. `null` values are technically outside the documented contract.
- No authentication or authorization is documented for GET /authors.
- `id` is `format: int64` — JavaScript's `Number` may lose precision for very large int64 values. If the API returns large IDs, validate using string comparison or BigInt.
