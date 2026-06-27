# PUT /authors/{id} — Negative Scenarios & Business Validations

---

## Endpoint Information

- **Method**: PUT
- **Endpoint**: `/authors/{id}`
- **Operation ID**: `updateAuthor`
- **Description**: Updates an existing author resource identified by `{id}`. Returns 200 on success.
- **Content-Type (request)**: `application/json`
- **Content-Type (response)**: `*/*`

---

## Preconditions

- The API server is reachable at `process.env.API_URL`.
- At least one author with a known `id` exists for field-level validation tests.
- A non-existent author `id` (e.g., `id = 999999999`) is reserved for not-found scenarios.
- Author resources used in negative tests are created via POST /authors in precondition setup.

---

## Test Data

```json
// Valid base payload for reference
{
  "firstName": "Jane",
  "lastName": "Austen"
}

// Wrong type — firstName as integer
{
  "firstName": 123,
  "lastName": "Austen"
}

// Wrong type — lastName as boolean
{
  "firstName": "Jane",
  "lastName": true
}

// Wrong type — firstName as array
{
  "firstName": ["Jane"],
  "lastName": "Austen"
}

// Wrong type — lastName as object
{
  "firstName": "Jane",
  "lastName": { "value": "Austen" }
}

// Wrong type — firstName as null
{
  "firstName": null,
  "lastName": "Austen"
}

// Malformed JSON (not valid JSON — used as raw string body)
// Example: '{ "firstName": "Jane", "lastName": }'

// Empty string values
{
  "firstName": "",
  "lastName": ""
}

// Extra/unknown fields
{
  "firstName": "Jane",
  "lastName": "Austen",
  "email": "jane@example.com",
  "age": 45
}

// Non-existent author ID: 999999999 (path param)
```

---

## Test Cases

---

### TC-NEG-AUTHORS-PUT-001

**Scenario**: PUT with non-existent author `id` — not found

**Purpose**: Validate behavior when the path param `id` does not correspond to an existing author resource.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = 999999999 (does not exist)
- **Query Params**: none
- **Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Austen"
}
```

**Expected Status Code**: `404` (not documented — see Notes)

**Expected Response**:
- Error response body (structure undocumented)

**Assertions**:
- `expect(response.status()).toBe(404)`
- Response body is not the Author object

> **Note**: A 404 error response is not documented in the OpenAPI spec for this endpoint. Expected based on standard REST conventions.

---

### TC-NEG-AUTHORS-PUT-002

**Scenario**: PUT with `id` = 0 (zero — invalid integer)

**Purpose**: Validate that a zero value for `id` is rejected or returns an appropriate error. IDs are typically positive integers.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = 0
- **Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Austen"
}
```

**Expected Status Code**: `400` or `404` (undocumented — see Notes)

**Assertions**:
- `expect([400, 404]).toContain(response.status())`
- Response is not a successful update

---

### TC-NEG-AUTHORS-PUT-003

**Scenario**: PUT with negative `id` (e.g., -1)

**Purpose**: Validate that a negative value for `id` is rejected or returns an appropriate error. Negative IDs are invalid resource identifiers.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = -1
- **Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Austen"
}
```

**Expected Status Code**: `400` or `404` (undocumented — see Notes)

**Assertions**:
- `expect([400, 404]).toContain(response.status())`
- Response is not a successful update

---

### TC-NEG-AUTHORS-PUT-004

**Scenario**: PUT with non-integer `id` in path (string value)

**Purpose**: Validate that a non-integer path param value is rejected. The `id` schema is `"type": "integer"`.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = `"abc"` (string, not integer)
- **Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Austen"
}
```

**Expected Status Code**: `400` (undocumented — see Notes)

**Assertions**:
- `expect(response.status()).toBe(400)`
- Response body is not a successful update object

---

### TC-NEG-AUTHORS-PUT-005

**Scenario**: `firstName` supplied as integer instead of string

**Purpose**: Validate type enforcement for `firstName` field (`"type": "string"`).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{
  "firstName": 123,
  "lastName": "Austen"
}
```

**Expected Status Code**: `400` (undocumented — see Notes)

**Assertions**:
- `expect(response.status()).toBe(400)`
- Response does not reflect a successful update

---

### TC-NEG-AUTHORS-PUT-006

**Scenario**: `lastName` supplied as boolean instead of string

**Purpose**: Validate type enforcement for `lastName` field (`"type": "string"`).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": true
}
```

**Expected Status Code**: `400` (undocumented — see Notes)

**Assertions**:
- `expect(response.status()).toBe(400)`
- Response does not reflect a successful update

---

### TC-NEG-AUTHORS-PUT-007

**Scenario**: `firstName` supplied as array instead of string

**Purpose**: Validate type enforcement for `firstName` field (`"type": "string"`).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{
  "firstName": ["Jane"],
  "lastName": "Austen"
}
```

**Expected Status Code**: `400` (undocumented — see Notes)

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-AUTHORS-PUT-008

**Scenario**: `lastName` supplied as object instead of string

**Purpose**: Validate type enforcement for `lastName` field (`"type": "string"`).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": { "value": "Austen" }
}
```

**Expected Status Code**: `400` (undocumented — see Notes)

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-AUTHORS-PUT-009

**Scenario**: Malformed JSON body

**Purpose**: Validate that a syntactically invalid JSON request body is rejected.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Raw Body** (invalid JSON):
```
{ "firstName": "Jane", "lastName": }
```

**Expected Status Code**: `400` (undocumented — see Notes)

**Assertions**:
- `expect(response.status()).toBe(400)`
- Response is not a successful update

---

### TC-NEG-AUTHORS-PUT-010

**Scenario**: Request sent without `Content-Type: application/json` header

**Purpose**: Validate that the API rejects requests with incorrect or missing `Content-Type`.

**Request**

- **Headers**: `Content-Type: text/plain` (or no Content-Type header)
- **Path Params**: `id` = existing author ID
- **Body**: `{ "firstName": "Jane", "lastName": "Austen" }` (sent as plain text)

**Expected Status Code**: `415` (undocumented — see Notes)

**Assertions**:
- `expect([400, 415]).toContain(response.status())`

---

### TC-NEG-AUTHORS-PUT-011

**Scenario**: `firstName` as null value

**Purpose**: Validate behavior when `firstName` is explicitly set to `null`. Null values are not declared as allowed in the schema (no `nullable: true`).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{
  "firstName": null,
  "lastName": "Austen"
}
```

**Expected Status Code**: `400` (undocumented — see Notes)

**Assertions**:
- `expect(response.status()).toBe(400)`

> **Note**: Null behavior is undocumented. The field is typed as `"type": "string"` with no `nullable: true`, so null should be rejected.

---

### TC-NEG-AUTHORS-PUT-012

**Scenario**: Empty string for `firstName` and `lastName`

**Purpose**: Validate behavior when both fields are explicitly set to empty strings. No `minLength` constraint is documented.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{
  "firstName": "",
  "lastName": ""
}
```

**Expected Status Code**: `200` or `400` (undocumented — see Notes)

**Assertions**:
- Document actual behavior — either 200 (empty strings accepted) or 400 (empty strings rejected)
- If 200: verify persistence via GET /authors/{id}

> **Note**: No `minLength` constraint exists in the spec. Expected behavior with empty strings is ambiguous.

---

### TC-NEG-AUTHORS-PUT-013

**Scenario**: Unknown/extra fields in request body

**Purpose**: Validate behavior when the request body includes fields not defined in `UpdateAuthorPayload` (e.g., `email`, `age`).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Austen",
  "email": "jane@example.com",
  "age": 45
}
```

**Expected Status Code**: `200` (unknown fields likely ignored — undocumented)

**Assertions**:
- `expect(response.status()).toBe(200)`
- Unknown fields (`email`, `age`) are NOT reflected in response body
- Core update (`firstName`, `lastName`) is applied

> **Note**: The spec does not define `additionalProperties: false` on `UpdateAuthorPayload`, so unknown fields are likely silently ignored. Document actual behavior.

---

## Notes

1. **No error responses documented**: The OpenAPI spec documents only `200 OK` for this endpoint. All error status codes listed above (400, 404, 415) are based on standard HTTP/REST conventions and are NOT contractually guaranteed. Actual behavior must be confirmed during test execution and documented.

2. **No `required` fields**: `UpdateAuthorPayload` has no `required` array. This makes it impossible to generate "missing required field" negative tests. The spec does not document what constitutes an invalid payload for this endpoint beyond type violations.

3. **No `nullable: true`**: Neither `firstName` nor `lastName` is declared nullable. TC-NEG-AUTHORS-PUT-011 tests null rejection, but actual behavior is undocumented.

4. **No string constraints**: No `minLength`, `maxLength`, or `pattern` is documented. TC-NEG-AUTHORS-PUT-012 tests empty strings, but the expected outcome must be discovered empirically.

5. **Non-integer path param**: The framework (Spring Boot) typically returns 400 for type coercion failures on path params, but this is not contractually documented.

6. **`additionalProperties` not restricted**: `UpdateAuthorPayload` does not declare `additionalProperties: false`, so unknown fields are likely silently ignored rather than rejected.
