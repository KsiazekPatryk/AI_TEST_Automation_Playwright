# POST /authors — Negative Scenarios and Business Validations

---

## Endpoint Information

- **Method:** POST
- **Endpoint:** /authors
- **API:** Bookstore API (`https://bookstoreapi.up.railway.app`)
- **Description:** Create a new author. Returns 400 for invalid or missing input.

---

## Preconditions

- API server is reachable at `API_URL` from `.env`.
- No authentication required.
- No test data setup needed — all negative cases are self-contained.

---

## Test Data

```json
// Missing both required fields
{}

// Missing firstName
{ "lastName": "Austen" }

// Missing lastName
{ "firstName": "Jane" }

// firstName is wrong type (integer)
{ "firstName": 123, "lastName": "Austen" }

// lastName is wrong type (boolean)
{ "firstName": "Jane", "lastName": true }

// Single-character firstName (undocumented min length violation)
{ "firstName": "A", "lastName": "Austen" }

// Single-character lastName (undocumented min length violation)
{ "firstName": "Jane", "lastName": "B" }

// Very long names (undocumented max length violation)
{ "firstName": "Alexandros".repeat(10), "lastName": "Papadimitriou".repeat(10) }
```

---

## Test Cases

---

### TC-NEG-POST-AUTHORS-001

**Scenario:** Missing all required fields — empty request body

**Purpose:** Verify the API rejects an empty object body. Both `firstName` and `lastName` are required.

**Request**
- Headers: `Content-Type: application/json`
- Request Body: `{}`

**Expected Status Code:** 400

**Assertions:**
- Status code equals 400.
- Response `Content-Type` contains `application/json`.

---

### TC-NEG-POST-AUTHORS-002

**Scenario:** Missing required `firstName`

**Purpose:** Verify the API returns 400 when `firstName` is absent from the payload.

**Request**
- Request Body: `{ "lastName": "Austen" }`

**Expected Status Code:** 400

**Assertions:**
- Status code equals 400.

---

### TC-NEG-POST-AUTHORS-003

**Scenario:** Missing required `lastName`

**Purpose:** Verify the API returns 400 when `lastName` is absent from the payload.

**Request**
- Request Body: `{ "firstName": "Jane" }`

**Expected Status Code:** 400

**Assertions:**
- Status code equals 400.

---

### TC-NEG-POST-AUTHORS-004

**Scenario:** `firstName` is wrong type — integer instead of string

**Purpose:** Verify the API rejects a non-string value for `firstName`.

**Request**
- Request Body: `{ "firstName": 123, "lastName": "Austen" }`

**Expected Status Code:** 400

**Assertions:**
- Status code equals 400.

---

### TC-NEG-POST-AUTHORS-005

**Scenario:** `lastName` is wrong type — boolean instead of string

**Purpose:** Verify the API rejects a non-string value for `lastName`.

**Request**
- Request Body: `{ "firstName": "Jane", "lastName": true }`

**Expected Status Code:** 400

**Assertions:**
- Status code equals 400.

---

### TC-NEG-POST-AUTHORS-006

**Scenario:** Single-character `firstName` — undocumented minimum length violation

**Purpose:** Verify the API rejects a single-character `firstName`. Discovered through exploratory testing: the API returns 400 for names shorter than a minimum length (not documented in OpenAPI spec).

**Request**
- Request Body: `{ "firstName": "A", "lastName": "Austen" }`

**Expected Status Code:** 400

**Assertions:**
- Status code equals 400.

---

### TC-NEG-POST-AUTHORS-007

**Scenario:** Single-character `lastName` — undocumented minimum length violation

**Purpose:** Verify the API rejects a single-character `lastName`.

**Request**
- Request Body: `{ "firstName": "Jane", "lastName": "B" }`

**Expected Status Code:** 400

**Assertions:**
- Status code equals 400.

---

### TC-NEG-POST-AUTHORS-008

**Scenario:** Extremely long name values — undocumented maximum length violation

**Purpose:** Verify the API rejects names that exceed an undocumented maximum length. Discovered through exploratory testing: `"Alexandros".repeat(10)` (100 chars) returns 400.

**Request**
- Request Body: `{ "firstName": "Alexandros".repeat(10), "lastName": "Papadimitriou".repeat(10) }`

**Expected Status Code:** 400

**Assertions:**
- Status code equals 400.

---

### TC-NEG-POST-AUTHORS-009

**Scenario:** Malformed JSON body

**Purpose:** Verify the API returns a 4xx response when the request body is not valid JSON.

**Request**
- Headers: `Content-Type: application/json`
- Request Body (raw malformed): `{ firstName: "Jane", lastName: }`

**Expected Status Code:** 400

**Assertions:**
- Status code is a 4xx code.
- Response does not expose a server stack trace.

---

### TC-NEG-POST-AUTHORS-010

**Scenario:** Request body is missing entirely

**Purpose:** Verify the API handles a completely absent body. The requestBody is marked `required: true` in the spec.

**Request**
- Body: none (omitted)

**Expected Status Code:** 400

**Assertions:**
- Status code equals 400.

---

## Notes

- TC-NEG-POST-AUTHORS-006, -007, -008: The minimum/maximum length constraints are NOT documented in the OpenAPI spec (`CreateAuthorPayload` only states `type: string` with no `minLength`/`maxLength`). These scenarios were discovered through exploratory testing. If the spec is updated to document these constraints, these tests should be updated accordingly.
- No 409 Conflict is documented — duplicate names are not a constraint.
- No authentication constraints exist for POST /authors per the spec.
