# POST /authors — Schema Validation Scenarios

---

## Endpoint Information

- **Method:** POST
- **Endpoint:** /authors
- **Operation ID:** createAuthor
- **API:** Bookstore API (`https://bookstoreapi.up.railway.app`)
- **Description:** Create a new author. Returns the created author resource on success with HTTP 201.

---

## Preconditions

- API server is reachable at `API_URL` from `.env`.
- No authentication is required.

---

## Test Data

```json
// Minimal valid payload (required fields)
{ "firstName": "Jane", "lastName": "Austen" }
```

---

## Test Cases

---

### TC-SCHEMA-POST-AUTHORS-001

**Scenario:** Successful creation returns HTTP 201

**Purpose:** Verify the endpoint returns the documented 201 status code for a valid request.

**Request**
- Headers: `Content-Type: application/json`
- Request Body: `{ "firstName": "Jane", "lastName": "Austen" }`

**Expected Status Code:** 201

**Assertions:**
- Status code equals 201.
- Response `Content-Type` header contains `application/json`.

---

### TC-SCHEMA-POST-AUTHORS-002

**Scenario:** Response body contains all required fields (`id`, `firstName`, `lastName`)

**Purpose:** Verify the response includes every field defined in the `Author` schema.

**Request**
- Headers: `Content-Type: application/json`
- Request Body: `{ "firstName": "Jane", "lastName": "Austen" }`

**Expected Status Code:** 201

**Assertions:**
- `id` field is present and is a positive integer.
- `firstName` field is present and is a string.
- `lastName` field is present and is a string.
- No required field is null or undefined.

---

### TC-SCHEMA-POST-AUTHORS-003

**Scenario:** `id` in response is a positive integer

**Purpose:** Verify `id` is server-generated, integer-typed, and positive.

**Request**
- Request Body: `{ "firstName": "Jane", "lastName": "Austen" }`

**Expected Status Code:** 201

**Assertions:**
- `id` is of type integer (not string, not float).
- `id` is greater than 0.

---

### TC-SCHEMA-POST-AUTHORS-004

**Scenario:** `firstName` and `lastName` in response are strings

**Purpose:** Verify string type conformance for both name fields.

**Request**
- Request Body: `{ "firstName": "Jane", "lastName": "Austen" }`

**Expected Status Code:** 201

**Assertions:**
- `firstName` is of type string and equals `"Jane"`.
- `lastName` is of type string and equals `"Austen"`.

---

### TC-SCHEMA-POST-AUTHORS-005

**Scenario:** 400 error response has `application/json` content-type

**Purpose:** Verify that a validation failure response is also JSON.

**Request**
- Request Body: `{}` (empty — missing required fields)

**Expected Status Code:** 400

**Assertions:**
- Status code equals 400.
- Response `Content-Type` header contains `application/json`.

---

### TC-SCHEMA-POST-AUTHORS-006

**Scenario:** Response body does not contain undocumented additional fields

**Purpose:** Verify the API does not expose fields beyond `id`, `firstName`, `lastName`.

**Request**
- Request Body: `{ "firstName": "Jane", "lastName": "Austen" }`

**Expected Status Code:** 201

**Assertions:**
- Response object keys are a subset of: `id`, `firstName`, `lastName`.

---

## Notes

- The `Author` schema returned by POST is not explicitly documented in the OpenAPI spec (response type is `object`). The `id`, `firstName`, `lastName` structure is inferred from GET /authors/{id} which returns `#/components/schemas/Author`.
- No `maxLength`/`minLength` are documented, but the API enforces undocumented constraints (e.g., single-character names return 400). See negative scenarios.
