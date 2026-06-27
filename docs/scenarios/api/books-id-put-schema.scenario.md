# PUT /books/{id} — Schema Validation Scenarios

---

## Endpoint Information

- **Method**: PUT
- **Endpoint**: `/books/{id}`
- **Operation ID**: `updateBook`
- **Description**: Replaces an existing book resource identified by `{id}`. Returns the updated book object.
- **Content-Type (request)**: `application/json`
- **Content-Type (response)**: `*/*` (see Notes)

---

## Preconditions

- At least one book exists in the system with a known `id`.
- The API server is reachable at `process.env.API_URL`.

---

## Test Data

```json
// Valid minimal UpdateBookPayload (all required fields)
{
  "authors": [1],
  "available": 10,
  "price": 29.99,
  "year": 2023
}

// Valid full UpdateBookPayload (required + optional title)
{
  "title": "Refactoring: Improving the Design of Existing Code",
  "authors": [1, 2],
  "available": 5,
  "price": 49.99,
  "year": 2018
}

// Price boundary values
// min inclusive: price = 1
// max inclusive: price = 10000

// Available boundary values
// min inclusive: available = 1
// max inclusive: available = 10000
```

---

## Test Cases

---

### TC-SCHEMA-PUT-001

**Scenario**: Successful update returns HTTP 200

**Purpose**: Confirm the success status code matches the OpenAPI contract.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID (integer, int64)
- **Query Params**: none
- **Request Body**:
```json
{
  "title": "Clean Code",
  "authors": [1],
  "available": 10,
  "price": 29.99,
  "year": 2008
}
```

**Expected Status Code**: `200`

**Expected Response**:
- Response body is a JSON object (schema: `{ "type": "object" }`)

**Assertions**:
- `expect(response.status()).toBe(200)`
- Response body is parseable as JSON
- Response body is an object (not null, not array, not primitive)

---

### TC-SCHEMA-PUT-002

**Scenario**: Response body is a JSON object (not an array, not null)

**Purpose**: Validate the top-level response type matches `{ "type": "object" }` schema.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Query Params**: none
- **Request Body**:
```json
{
  "title": "Clean Code",
  "authors": [1],
  "available": 10,
  "price": 29.99,
  "year": 2008
}
```

**Expected Status Code**: `200`

**Expected Response**:
- Body is a JSON object

**Assertions**:
- `typeof responseBody === 'object'`
- `!Array.isArray(responseBody)`
- `responseBody !== null`

---

### TC-SCHEMA-PUT-003

**Scenario**: Request body Content-Type is `application/json`

**Purpose**: Validate the API accepts `application/json` as documented.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Query Params**: none
- **Request Body**:
```json
{
  "authors": [1],
  "available": 5,
  "price": 15.00,
  "year": 2020
}
```

**Expected Status Code**: `200`

**Expected Response**: Valid JSON object

**Assertions**:
- `expect(response.status()).toBe(200)`
- Response body is valid JSON

---

### TC-SCHEMA-PUT-004

**Scenario**: `authors` in request is an array of integers (int64)

**Purpose**: Validate `authors` field type is accepted as integer array per schema.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 5,
  "price": 15.00,
  "year": 2020
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`

---

### TC-SCHEMA-PUT-005

**Scenario**: `price` field accepts decimal number

**Purpose**: Validate `price` is a `number` type (not integer-only).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 5,
  "price": 9.99,
  "year": 2020
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`

---

### TC-SCHEMA-PUT-006

**Scenario**: `year` field is `int32` format

**Purpose**: Validate `year` is accepted as integer per schema.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 5,
  "price": 20.00,
  "year": 2024
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`

---

### TC-SCHEMA-PUT-007

**Scenario**: `available` field is `int32` format

**Purpose**: Validate `available` is accepted as integer per schema.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 100,
  "price": 20.00,
  "year": 2024
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`

---

### TC-SCHEMA-PUT-008

**Scenario**: `title` is optional — request without `title` is accepted

**Purpose**: Confirm `title` is not in the `required` array and can be omitted.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 5,
  "price": 20.00,
  "year": 2020
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`

---

### TC-SCHEMA-PUT-009

**Scenario**: `authors` array enforces unique items

**Purpose**: Validate `uniqueItems: true` constraint — duplicate author IDs should be handled per API behavior.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1, 1],
  "available": 5,
  "price": 20.00,
  "year": 2020
}
```

**Expected Status Code**: Undocumented (see Notes — AMBIGUITY-002)

**Assertions**:
- Record actual status code and response for contract baseline

---

### TC-SCHEMA-PUT-010

**Scenario**: Path param `id` is integer (int64)

**Purpose**: Validate the path parameter type matches the schema definition.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = 9999999999 (large int64 value, book must exist)
- **Request Body**:
```json
{
  "authors": [1],
  "available": 5,
  "price": 20.00,
  "year": 2020
}
```

**Expected Status Code**: `200` (if book exists) or undocumented error (see Notes — AMBIGUITY-001)

**Assertions**:
- Path param is integer — string `"abc"` should not match

---

## Notes

| ID | Description |
|----|-------------|
| AMBIGUITY-001 | No `404` response is documented for `PUT /books/{id}` when `id` does not refer to an existing book. Actual behavior is unknown from the spec. |
| AMBIGUITY-002 | `authors` has `uniqueItems: true` but no documented error response for duplicate entries. Behavior on validation failure is unknown. |
| AMBIGUITY-003 | Response schema is `{ "type": "object" }` — no properties are documented. It is impossible to validate specific response fields from the spec alone. |
| AMBIGUITY-004 | Response Content-Type is `*/*` — no specific media type is guaranteed. Actual content-type header in the response is not contractually constrained. |
| AMBIGUITY-005 | No authentication or authorization is documented on this endpoint. It is unclear whether any auth header is required. |
| AMBIGUITY-006 | `price` constraints differ between `CreateBookPayload` (min=0.01, max=1000) and `UpdateBookPayload` (min=1, max=10000). This appears intentional but is not explained. |
| AMBIGUITY-007 | `title` is optional but not marked nullable. It is unclear whether omitting `title` clears the existing title or leaves it unchanged (partial vs. full replacement). |
