# PUT /authors/{id} — Positive Scenarios

---

## Endpoint Information

- **Method**: PUT
- **Endpoint**: `/authors/{id}`
- **Operation ID**: `updateAuthor`
- **Description**: Updates an existing author resource identified by `{id}`. Both `firstName` and `lastName` are optional per the OpenAPI schema.
- **Content-Type (request)**: `application/json`
- **Content-Type (response)**: `*/*`

---

## Preconditions

- At least one author exists in the system with a known `id`.
- Tests create their own author resource via POST /authors before running PUT assertions to ensure test isolation.
- The API server is reachable at `process.env.API_URL`.

---

## Test Data

```json
// Full payload — both fields supplied
{
  "firstName": "Jane",
  "lastName": "Austen"
}

// Only firstName supplied
{
  "firstName": "Charlotte"
}

// Only lastName supplied
{
  "lastName": "Bronte"
}

// Empty body — both fields omitted (valid per schema — no required fields)
{}

// Long string values (no maxLength constraint documented)
{
  "firstName": "Alexandrina",
  "lastName": "Victoria-Saxe-Coburg-and-Gotha"
}

// Fields with leading/trailing whitespace (behavior undocumented)
{
  "firstName": " Emily ",
  "lastName": " Dickinson "
}

// Unicode / non-ASCII characters (no pattern constraint documented)
{
  "firstName": "Søren",
  "lastName": "Kierkegaard"
}
```

---

## Test Cases

---

### TC-POS-AUTHORS-PUT-001

**Scenario**: Update author with both `firstName` and `lastName` — success

**Purpose**: Validate the happy path. Both fields supplied, response is 200.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID (created via POST in precondition)
- **Query Params**: none
- **Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Austen"
}
```

**Expected Status Code**: `200`

**Expected Response**:
- JSON object

**Assertions**:
- `expect(response.status()).toBe(200)`
- Response body is a non-null JSON object
- If `firstName` is returned: `responseBody.firstName === 'Jane'`
- If `lastName` is returned: `responseBody.lastName === 'Austen'`

---

### TC-POS-AUTHORS-PUT-002

**Scenario**: Update author with `firstName` only

**Purpose**: Validate that `firstName` is accepted as a standalone field since neither field is marked required in the schema.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Query Params**: none
- **Request Body**:
```json
{
  "firstName": "Charlotte"
}
```

**Expected Status Code**: `200`

**Expected Response**:
- JSON object

**Assertions**:
- `expect(response.status()).toBe(200)`
- Response body is a non-null JSON object
- If `firstName` is returned: `responseBody.firstName === 'Charlotte'`

---

### TC-POS-AUTHORS-PUT-003

**Scenario**: Update author with `lastName` only

**Purpose**: Validate that `lastName` is accepted as a standalone field since neither field is marked required in the schema.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Query Params**: none
- **Request Body**:
```json
{
  "lastName": "Bronte"
}
```

**Expected Status Code**: `200`

**Expected Response**:
- JSON object

**Assertions**:
- `expect(response.status()).toBe(200)`
- Response body is a non-null JSON object
- If `lastName` is returned: `responseBody.lastName === 'Bronte'`

---

### TC-POS-AUTHORS-PUT-004

**Scenario**: Update author — data persistence after successful update

**Purpose**: Validate that the updated values are actually persisted. After a successful PUT, a subsequent GET /authors/{id} should reflect the new values.

**Request** (Step 1 — PUT)

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{
  "firstName": "Emily",
  "lastName": "Dickinson"
}
```

**Request** (Step 2 — GET /authors/{id})

- **Path Params**: `id` = same author ID

**Expected Status Code (PUT)**: `200`

**Expected Status Code (GET)**: `200`

**Assertions**:
- PUT: `expect(response.status()).toBe(200)`
- GET: `expect(getResponse.status()).toBe(200)`
- GET response: `responseBody.firstName === 'Emily'`
- GET response: `responseBody.lastName === 'Dickinson'`

---

### TC-POS-AUTHORS-PUT-005

**Scenario**: Update author with Unicode / non-ASCII characters in name fields

**Purpose**: Validate that non-ASCII string values are accepted since no `pattern` constraint is documented.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{
  "firstName": "Søren",
  "lastName": "Kierkegaard"
}
```

**Expected Status Code**: `200`

**Expected Response**:
- JSON object

**Assertions**:
- `expect(response.status()).toBe(200)`
- Response body is a non-null JSON object

---

### TC-POS-AUTHORS-PUT-006

**Scenario**: Update the same author twice — idempotent behavior

**Purpose**: Validate that calling PUT with the same payload twice produces a 200 on both calls and the final state reflects the last PUT.

**Request** (Call 1)
```json
{ "firstName": "Leo", "lastName": "Tolstoy" }
```

**Request** (Call 2 — same payload, same `id`)
```json
{ "firstName": "Leo", "lastName": "Tolstoy" }
```

**Expected Status Code**: `200` for both calls

**Assertions**:
- First PUT: `expect(response.status()).toBe(200)`
- Second PUT: `expect(response.status()).toBe(200)`
- GET after second PUT: `firstName === 'Leo'`, `lastName === 'Tolstoy'`

---

### TC-POS-AUTHORS-PUT-007

**Scenario**: Update author — overwrite with different values

**Purpose**: Validate that a second PUT with different values overwrites the first update correctly.

**Request** (Step 1 — initial PUT)
```json
{ "firstName": "Anton", "lastName": "Chekhov" }
```

**Request** (Step 2 — overwrite PUT, same `id`)
```json
{ "firstName": "Fyodor", "lastName": "Dostoevsky" }
```

**Request** (Step 3 — verify with GET /authors/{id})

**Expected Status Code**: `200` for both PUTs

**Assertions**:
- Both PUTs return `200`
- GET response: `firstName === 'Fyodor'`
- GET response: `lastName === 'Dostoevsky'`

---

## Notes

1. **No required fields**: Neither `firstName` nor `lastName` is documented as required in `UpdateAuthorPayload`. This makes it ambiguous whether PUT performs a full resource replacement (clearing omitted fields) or behaves like a partial update. TC-POS-AUTHORS-PUT-002, TC-POS-AUTHORS-PUT-003 explore this boundary.

2. **Response body content**: The 200 response schema is `{ "type": "object" }` — the exact fields returned are not specified. Assertions on `firstName`, `lastName`, and `id` in the response body are conditional (`if present`) due to this ambiguity.

3. **No string constraints**: `firstName` and `lastName` have no `minLength`, `maxLength`, or `pattern` constraints. Behavior with empty strings `""`, very long strings, or special characters is undocumented.
