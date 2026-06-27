# PUT /books/{id} — Negative Scenarios & Business Validations

---

## Endpoint Information

- **Method**: PUT
- **Endpoint**: `/books/{id}`
- **Operation ID**: `updateBook`
- **Description**: Replaces an existing book resource identified by `{id}`. All four required fields must be present. Returns updated book on success.
- **Content-Type (request)**: `application/json`
- **Content-Type (response)**: `*/*`

---

## Preconditions

- The API server is reachable at `process.env.API_URL`.
- At least one book with a known `id` exists for tests that validate field-level validation (not 404).
- A non-existent book `id` (e.g., `id = 999999999`) is available for 404-type scenarios.
- All `id` values used in tests are set up and verified before assertion.

---

## Test Data

```json
// Base valid payload for modification
{
  "title": "Clean Code",
  "authors": [1],
  "available": 10,
  "price": 29.99,
  "year": 2008
}

// Payloads with missing required fields
// Missing "authors":
{ "available": 10, "price": 29.99, "year": 2008 }

// Missing "available":
{ "authors": [1], "price": 29.99, "year": 2008 }

// Missing "price":
{ "authors": [1], "available": 10, "year": 2008 }

// Missing "year":
{ "authors": [1], "available": 10, "price": 29.99 }

// Missing all required fields:
{ "title": "Only Title" }

// Empty body:
{}

// price below minimum (< 1):
{ "authors": [1], "available": 10, "price": 0.99, "year": 2008 }

// price = 0:
{ "authors": [1], "available": 10, "price": 0, "year": 2008 }

// price above maximum (> 10000):
{ "authors": [1], "available": 10, "price": 10001, "year": 2008 }

// available below minimum (< 1):
{ "authors": [1], "available": 0, "price": 20.00, "year": 2008 }

// available above maximum (> 10000):
{ "authors": [1], "available": 10001, "price": 20.00, "year": 2008 }

// Wrong types
// authors as string:
{ "authors": "1", "available": 10, "price": 29.99, "year": 2008 }

// price as string:
{ "authors": [1], "available": 10, "price": "cheap", "year": 2008 }

// year as string:
{ "authors": [1], "available": 10, "price": 29.99, "year": "two-thousand" }

// available as string:
{ "authors": [1], "available": "ten", "price": 29.99, "year": 2008 }

// authors as integer (not array):
{ "authors": 1, "available": 10, "price": 29.99, "year": 2008 }

// Malformed JSON (raw string, not valid JSON):
"not-a-json-string"
```

---

## Test Cases

---

### TC-NEG-PUT-001

**Scenario**: Missing required field `authors`

**Purpose**: Validate that omitting `authors` (required) is rejected.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "available": 10,
  "price": 29.99,
  "year": 2008
}
```

**Expected Status Code**: `400` (see Notes — AMBIGUITY-001: exact code undocumented)

**Expected Response**:
- Error response body (structure undocumented)

**Assertions**:
- `expect(response.status()).toBe(400)`
- Response is not `200`

---

### TC-NEG-PUT-002

**Scenario**: Missing required field `available`

**Purpose**: Validate that omitting `available` (required) is rejected.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "price": 29.99,
  "year": 2008
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-003

**Scenario**: Missing required field `price`

**Purpose**: Validate that omitting `price` (required) is rejected.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10,
  "year": 2008
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-004

**Scenario**: Missing required field `year`

**Purpose**: Validate that omitting `year` (required) is rejected.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10,
  "price": 29.99
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-005

**Scenario**: Empty request body (`{}`)

**Purpose**: Validate that a completely empty object missing all required fields is rejected.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-006

**Scenario**: Only optional `title` provided, all required fields missing

**Purpose**: Validate that providing only optional fields without required fields is rejected.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "title": "Only Title"
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-007

**Scenario**: `price` below minimum (0.99 < 1)

**Purpose**: Validate `price` minimum constraint: `minimum: 1, exclusiveMinimum: false`.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10,
  "price": 0.99,
  "year": 2020
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-008

**Scenario**: `price` = 0 (below minimum)

**Purpose**: Validate `price` = 0 is rejected (minimum is 1).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10,
  "price": 0,
  "year": 2020
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-009

**Scenario**: `price` above maximum (10001 > 10000)

**Purpose**: Validate `price` maximum constraint: `maximum: 10000, exclusiveMaximum: false`.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10,
  "price": 10001,
  "year": 2020
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-010

**Scenario**: `available` below minimum (0 < 1)

**Purpose**: Validate `available` minimum constraint: `minimum: 1`.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 0,
  "price": 20.00,
  "year": 2020
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-011

**Scenario**: `available` above maximum (10001 > 10000)

**Purpose**: Validate `available` maximum constraint: `maximum: 10000`.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10001,
  "price": 20.00,
  "year": 2020
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-012

**Scenario**: `price` as string instead of number

**Purpose**: Validate type enforcement for `price` field (`type: number`).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10,
  "price": "cheap",
  "year": 2020
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-013

**Scenario**: `year` as string instead of integer

**Purpose**: Validate type enforcement for `year` field (`type: integer, format: int32`).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10,
  "price": 20.00,
  "year": "two-thousand"
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-014

**Scenario**: `available` as string instead of integer

**Purpose**: Validate type enforcement for `available` field (`type: integer, format: int32`).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": "ten",
  "price": 20.00,
  "year": 2020
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-015

**Scenario**: `authors` as a plain integer instead of array

**Purpose**: Validate type enforcement — `authors` must be an array, not a scalar integer.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": 1,
  "available": 10,
  "price": 20.00,
  "year": 2020
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-016

**Scenario**: `authors` as string instead of array

**Purpose**: Validate type enforcement — `authors` must be an array of integers.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": "1",
  "available": 10,
  "price": 20.00,
  "year": 2020
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-017

**Scenario**: Malformed JSON body

**Purpose**: Validate that a non-parseable request body is rejected.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body** (raw string, not valid JSON):
```
not-a-json-string
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-018

**Scenario**: `id` path param does not exist (non-existent book)

**Purpose**: Validate behavior when a book with the given `id` is not found.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = 999999999 (book must not exist)
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10,
  "price": 29.99,
  "year": 2020
}
```

**Expected Status Code**: `404` (see Notes — AMBIGUITY-001: exact code undocumented)

**Assertions**:
- `expect(response.status()).toBe(404)`
- Response is not `200`

---

### TC-NEG-PUT-019

**Scenario**: `id` path param is non-numeric string

**Purpose**: Validate that a non-integer path param value is rejected at the routing level.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = `"abc"`
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10,
  "price": 29.99,
  "year": 2020
}
```

**Expected Status Code**: `400` (see Notes — AMBIGUITY-002: exact code undocumented)

**Assertions**:
- `expect(response.status()).not.toBe(200)`
- `expect([400, 404, 405]).toContain(response.status())`

---

### TC-NEG-PUT-020

**Scenario**: `authors` contains a non-existent author ID

**Purpose**: Validate that referencing an author ID that does not exist triggers a validation error.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [999999999],
  "available": 10,
  "price": 29.99,
  "year": 2020
}
```

**Expected Status Code**: `400` or `404` (see Notes — AMBIGUITY-003: undocumented)

**Assertions**:
- `expect(response.status()).not.toBe(200)`

---

### TC-NEG-PUT-021

**Scenario**: `price` as negative number

**Purpose**: Validate that a negative `price` value is rejected (below minimum of 1).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10,
  "price": -5.00,
  "year": 2020
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

### TC-NEG-PUT-022

**Scenario**: `available` as negative number

**Purpose**: Validate that a negative `available` value is rejected (below minimum of 1).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": -1,
  "price": 20.00,
  "year": 2020
}
```

**Expected Status Code**: `400`

**Assertions**:
- `expect(response.status()).toBe(400)`

---

## Notes

| ID | Description |
|----|-------------|
| AMBIGUITY-001 | No error response codes (4xx) are documented in the OpenAPI spec for `PUT /books/{id}`. Expected codes like `400` (validation failure) and `404` (book not found) are inferred from standard HTTP semantics and similar APIs in this spec (e.g., POST patterns), NOT from explicit documentation. These must be verified against actual API behavior. |
| AMBIGUITY-002 | Behavior for non-numeric path param (e.g., `id = "abc"`) is not documented. Framework-level routing may return `400`, `404`, or `405`. TC-NEG-PUT-019 uses a permissive assertion. |
| AMBIGUITY-003 | No documented behavior for referencing non-existent author IDs in the `authors` array. The API might return `400`, `404`, or silently ignore invalid IDs. |
| AMBIGUITY-004 | `price` constraints differ between `UpdateBookPayload` (min=1, max=10000) and `CreateBookPayload` (min=0.01, max=1000). These constraints are independently documented and appear intentional, but no explanation is provided in the spec. |
| AMBIGUITY-005 | `authors` array has `uniqueItems: true` but no documented error for duplicate entries. Duplicate-entry behavior is covered in schema scenarios (TC-SCHEMA-PUT-009) due to this ambiguity. |
| AMBIGUITY-006 | No authentication or authorization mechanisms are documented. Unauthorized/forbidden scenarios cannot be generated from the spec alone. |
