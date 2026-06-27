# PUT /books/{id} — Positive Scenarios

---

## Endpoint Information

- **Method**: PUT
- **Endpoint**: `/books/{id}`
- **Operation ID**: `updateBook`
- **Description**: Replaces an existing book resource identified by `{id}`. Required fields: `authors`, `available`, `price`, `year`. Optional field: `title`.
- **Content-Type (request)**: `application/json`
- **Content-Type (response)**: `*/*`

---

## Preconditions

- At least one book exists in the system with a known `id`.
- At least one author exists in the system with a known `id`.
- Multiple authors exist for multi-author scenarios.
- The API server is reachable at `process.env.API_URL`.
- Tests create their own book and author resources via POST before running PUT assertions.

---

## Test Data

```json
// Minimal valid payload (required fields only, no title)
{
  "authors": [1],
  "available": 10,
  "price": 29.99,
  "year": 2020
}

// Full valid payload (required + optional title)
{
  "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
  "authors": [1],
  "available": 25,
  "price": 45.00,
  "year": 2008
}

// Boundary: price minimum inclusive (1)
{
  "authors": [1],
  "available": 1,
  "price": 1,
  "year": 2023
}

// Boundary: price maximum inclusive (10000)
{
  "authors": [1],
  "available": 10000,
  "price": 10000,
  "year": 2023
}

// Multi-author payload
{
  "title": "Designing Data-Intensive Applications",
  "authors": [1, 2],
  "available": 50,
  "price": 55.00,
  "year": 2017
}
```

---

## Test Cases

---

### TC-POS-PUT-001

**Scenario**: Update book with all required fields — success

**Purpose**: Validate the happy path. All required fields supplied, response is 200.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID (created via POST in precondition)
- **Query Params**: none
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10,
  "price": 29.99,
  "year": 2020
}
```

**Expected Status Code**: `200`

**Expected Response**:
- JSON object

**Assertions**:
- `expect(response.status()).toBe(200)`
- Response body is a non-null JSON object

---

### TC-POS-PUT-002

**Scenario**: Update book with all fields including optional `title`

**Purpose**: Validate that `title` is accepted when included alongside required fields.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
  "authors": [1],
  "available": 25,
  "price": 45.00,
  "year": 2008
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`
- Response body is a non-null JSON object

---

### TC-POS-PUT-003

**Scenario**: Update book — `price` at minimum boundary (1)

**Purpose**: Validate `price` minimum inclusive boundary: `minimum: 1, exclusiveMinimum: false`.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 5,
  "price": 1,
  "year": 2021
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`

---

### TC-POS-PUT-004

**Scenario**: Update book — `price` at maximum boundary (10000)

**Purpose**: Validate `price` maximum inclusive boundary: `maximum: 10000, exclusiveMaximum: false`.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 5,
  "price": 10000,
  "year": 2021
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`

---

### TC-POS-PUT-005

**Scenario**: Update book — `available` at minimum boundary (1)

**Purpose**: Validate `available` minimum inclusive boundary: `minimum: 1`.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 1,
  "price": 20.00,
  "year": 2021
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`

---

### TC-POS-PUT-006

**Scenario**: Update book — `available` at maximum boundary (10000)

**Purpose**: Validate `available` maximum inclusive boundary: `maximum: 10000`.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 10000,
  "price": 20.00,
  "year": 2021
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`

---

### TC-POS-PUT-007

**Scenario**: Update book with multiple unique authors

**Purpose**: Validate `authors` array accepts multiple distinct integer IDs (`uniqueItems: true`).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID (created with one author)
- **Request Body**:
```json
{
  "title": "Designing Data-Intensive Applications",
  "authors": [1, 2],
  "available": 50,
  "price": 55.00,
  "year": 2017
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`

---

### TC-POS-PUT-008

**Scenario**: Update previously updated book — idempotent re-update

**Purpose**: Validate that calling PUT on the same book twice with the same payload yields `200` both times.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body** (same payload for both calls):
```json
{
  "title": "The Pragmatic Programmer",
  "authors": [1],
  "available": 15,
  "price": 39.99,
  "year": 1999
}
```

**Steps**:
1. Send PUT with payload above → expect `200`
2. Send identical PUT again → expect `200`

**Expected Status Code**: `200` on both calls

**Assertions**:
- `expect(firstResponse.status()).toBe(200)`
- `expect(secondResponse.status()).toBe(200)`

---

### TC-POS-PUT-009

**Scenario**: Update `year` with current calendar year

**Purpose**: Validate the API accepts a current-year value for `year` (int32).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 5,
  "price": 19.99,
  "year": 2026
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`

---

### TC-POS-PUT-010

**Scenario**: Update book then verify via GET /books/{id}

**Purpose**: Validate data persistence — updated data is reflected in subsequent GET.

**Preconditions**: The `Book` response schema from GET /books/{id} is used for field verification.

**Steps**:
1. PUT `/books/{id}` with:
```json
{
  "title": "Domain-Driven Design",
  "authors": [1],
  "available": 30,
  "price": 59.99,
  "year": 2003
}
```
2. GET `/books/{id}` and inspect the returned `Book` object.

**Expected Status Code**:
- PUT: `200`
- GET: `200`

**Expected Response (GET)**:
- `title` = `"Domain-Driven Design"` (see Notes — AMBIGUITY-001: behavior when title is omitted in PUT is uncertain, but when title is supplied it should persist)
- `year` = `2003`
- `price` = `59.99`
- `available` = `30`
- `authors` array contains at least one entry with `id` = `1`

**Assertions**:
- `expect(putResponse.status()).toBe(200)`
- `expect(getResponse.status()).toBe(200)`
- `expect(book.title).toBe('Domain-Driven Design')`
- `expect(book.year).toBe(2003)`
- `expect(book.price).toBe(59.99)`
- `expect(book.available).toBe(30)`
- `expect(book.authors.some(a => a.id === 1)).toBe(true)`

---

### TC-POS-PUT-011

**Scenario**: Update book — `price` as decimal with two decimal places

**Purpose**: Validate `price` as a `number` type accepting decimal precision.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing book ID
- **Request Body**:
```json
{
  "authors": [1],
  "available": 5,
  "price": 49.99,
  "year": 2022
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`

---

## Notes

| ID | Description |
|----|-------------|
| AMBIGUITY-001 | It is undocumented whether omitting `title` in PUT clears the existing title (full replacement semantics) or preserves the previous value (partial update). TC-POS-PUT-010 only covers the case where title is explicitly provided. |
| AMBIGUITY-002 | The response body schema is `{ "type": "object" }` with no documented fields. Data persistence assertions in TC-POS-PUT-010 rely on the separately-documented GET /books/{id} `Book` schema, not the PUT response itself. |
| AMBIGUITY-003 | No minimum for `year` is documented. TC-POS-PUT-009 uses current year; historic years (e.g., year=1) are not tested as acceptance is undocumented. |
