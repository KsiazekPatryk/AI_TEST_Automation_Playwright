# PUT /authors/{id} — Schema Validation Scenarios

---

## Endpoint Information

- **Method**: PUT
- **Endpoint**: `/authors/{id}`
- **Operation ID**: `updateAuthor`
- **Description**: Updates an existing author resource identified by `{id}`.
- **Content-Type (request)**: `application/json`
- **Content-Type (response)**: `*/*` (see Notes)

---

## Preconditions

- At least one author exists in the system with a known `id`.
- The API server is reachable at `process.env.API_URL`.

---

## Test Data

```json
// Valid UpdateAuthorPayload — both fields supplied
{
  "firstName": "Jane",
  "lastName": "Austen"
}

// Valid UpdateAuthorPayload — firstName only
{
  "firstName": "Jane"
}

// Valid UpdateAuthorPayload — lastName only
{
  "lastName": "Austen"
}
```

---

## Test Cases

---

### TC-SCHEMA-AUTHORS-PUT-001

**Scenario**: Successful update returns HTTP 200

**Purpose**: Confirm the success status code matches the OpenAPI contract.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID (integer, int64)
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
- Response body is a JSON object (schema: `{ "type": "object" }`)

**Assertions**:
- `expect(response.status()).toBe(200)`
- Response body is parseable as JSON
- Response body is an object (not null, not array, not primitive)

---

### TC-SCHEMA-AUTHORS-PUT-002

**Scenario**: Response body is a JSON object (not an array, not null)

**Purpose**: Validate the top-level response type matches `{ "type": "object" }` as documented in the OpenAPI spec.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
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
- Body is a JSON object

**Assertions**:
- `typeof responseBody === 'object'`
- `!Array.isArray(responseBody)`
- `responseBody !== null`

---

### TC-SCHEMA-AUTHORS-PUT-003

**Scenario**: Request body Content-Type is `application/json`

**Purpose**: Validate the API accepts `application/json` as documented in the request body contract.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Query Params**: none
- **Request Body**:
```json
{
  "firstName": "Charlotte",
  "lastName": "Bronte"
}
```

**Expected Status Code**: `200`

**Expected Response**: Valid JSON object

**Assertions**:
- `expect(response.status()).toBe(200)`
- Response is parseable as JSON without error

---

### TC-SCHEMA-AUTHORS-PUT-004

**Scenario**: `firstName` field in response body is of type string (if present)

**Purpose**: Validate `firstName` field type matches the `Author` schema (`"type": "string"`) when returned in the response body.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{
  "firstName": "Emily",
  "lastName": "Dickinson"
}
```

**Expected Status Code**: `200`

**Expected Response**:
- If `firstName` is present in response body: it must be of type string

**Assertions**:
- If `responseBody.firstName` exists: `typeof responseBody.firstName === 'string'`
- `responseBody.firstName` is not a number, boolean, array, or object

---

### TC-SCHEMA-AUTHORS-PUT-005

**Scenario**: `lastName` field in response body is of type string (if present)

**Purpose**: Validate `lastName` field type matches the `Author` schema (`"type": "string"`) when returned in the response body.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{
  "firstName": "Emily",
  "lastName": "Dickinson"
}
```

**Expected Status Code**: `200`

**Expected Response**:
- If `lastName` is present in response body: it must be of type string

**Assertions**:
- If `responseBody.lastName` exists: `typeof responseBody.lastName === 'string'`
- `responseBody.lastName` is not a number, boolean, array, or object

---

### TC-SCHEMA-AUTHORS-PUT-006

**Scenario**: `id` field in response body is of type integer (if present)

**Purpose**: Validate `id` field type matches the `Author` schema (`"type": "integer", "format": "int64"`) when returned in the response body.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{
  "firstName": "Emily",
  "lastName": "Dickinson"
}
```

**Expected Status Code**: `200`

**Expected Response**:
- If `id` is present in response body: it must be an integer

**Assertions**:
- If `responseBody.id` exists: `typeof responseBody.id === 'number'`
- If `responseBody.id` exists: `Number.isInteger(responseBody.id)`

---

### TC-SCHEMA-AUTHORS-PUT-007

**Scenario**: Path parameter `id` is typed as integer (int64)

**Purpose**: Validate that the path parameter type constraint (`"type": "integer", "format": "int64"`) is enforced at the contract level.

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = 1 (integer, int64)
- **Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Austen"
}
```

**Expected Status Code**: `200`

**Assertions**:
- `expect(response.status()).toBe(200)`
- Path param is sent as a numeric integer, not a string

---

### TC-SCHEMA-AUTHORS-PUT-008

**Scenario**: `UpdateAuthorPayload` properties `firstName` and `lastName` are both optional (no `required` array)

**Purpose**: Confirm that the schema allows both fields to be omitted simultaneously per the OpenAPI contract (no `required` declaration on `UpdateAuthorPayload`).

**Request**

- **Headers**: `Content-Type: application/json`
- **Path Params**: `id` = existing author ID
- **Request Body**:
```json
{}
```

**Expected Status Code**: `200` (based on schema — no required fields documented)

**Expected Response**: JSON object

**Assertions**:
- `expect(response.status()).toBe(200)`
- Response body is a non-null JSON object

> **Note**: The actual behavior with an empty body is undocumented. See Notes section.

---

## Notes

1. **Generic response schema**: The PUT `/authors/{id}` response is typed as `{ "type": "object" }` — it does NOT reference the `Author` schema. The exact response fields (`id`, `firstName`, `lastName`) are not contractually guaranteed for this operation. Schema assertions for individual fields are best-effort based on observed behavior and the `Author` schema used by `GET /authors/{id}`.

2. **`*/*` response Content-Type**: The response `content` key uses `*/*` which means the API does not constrain the response content type. In practice, it likely returns `application/json`, but this is not contractually enforced.

3. **No `required` fields in `UpdateAuthorPayload`**: Unlike most PUT endpoints (which require a full resource representation), neither `firstName` nor `lastName` is marked as required. It is ambiguous whether this endpoint performs a full replacement (nulling omitted fields) or a partial update. Behavior with an empty `{}` body is not documented.
