# Positive Scenarios — GET /books

---

# Endpoint Information

- **Method:** GET
- **Endpoint:** /books
- **Description:** Returns a list of books. Supports optional filtering by `title` and `author` query parameters.

---

# Preconditions

- API server is running and reachable using the configured API base URL.
- No authentication requirement is documented in OpenAPI for this operation.
- Test data setup may create books through documented API operations before execution when deterministic filter assertions are required.

---

# Test Data

**Valid headers:**
```http
Accept: application/json
```

**Valid query parameters:**
```text
title=<string>
author=<string>
```

**Reusable filter values:**
```text
title=<existing book title from setup or seeded data>
author=<existing author name from setup or seeded data>
```

**Request body:** None. `GET /books` has no documented request body.

---

# Test Cases

---

## Test Case ID
POS-BOOKS-GET-001

## Scenario
Retrieve all books without filters

## Purpose
Validate the documented happy path for retrieving the books collection.

## Request

### Headers
```http
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
Response body is an array of `RestBook` objects. The array may be empty because OpenAPI does not define a minimum item count.

## Assertions
- Status code equals `200`.
- Response body is an array.
- Every returned item conforms to the documented `RestBook` schema.

---

## Test Case ID
POS-BOOKS-GET-002

## Scenario
Retrieve books filtered by `title`

## Purpose
Validate successful use of the documented optional `title` query parameter.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
```text
title=<existing book title from setup or seeded data>
```

### Request Body
None

## Expected Status Code
200

## Expected Response
Response body is an array of `RestBook` objects.

## Assertions
- Status code equals `200`.
- Response body is an array.
- Every returned item conforms to the documented `RestBook` schema.
- When filter semantics are verified against seeded data, returned books are consistent with the requested `title` value.

---

## Test Case ID
POS-BOOKS-GET-003

## Scenario
Retrieve books filtered by `author`

## Purpose
Validate successful use of the documented optional `author` query parameter.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
```text
author=<existing author name from setup or seeded data>
```

### Request Body
None

## Expected Status Code
200

## Expected Response
Response body is an array of `RestBook` objects.

## Assertions
- Status code equals `200`.
- Response body is an array.
- Every returned item conforms to the documented `RestBook` schema.
- When filter semantics are verified against seeded data, returned books are consistent with the requested `author` value.

---

## Test Case ID
POS-BOOKS-GET-004

## Scenario
Retrieve books filtered by both `title` and `author`

## Purpose
Validate successful use of both documented optional query parameters in one request.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
```text
title=<existing book title from setup or seeded data>
author=<existing author name from setup or seeded data>
```

### Request Body
None

## Expected Status Code
200

## Expected Response
Response body is an array of `RestBook` objects.

## Assertions
- Status code equals `200`.
- Response body is an array.
- Every returned item conforms to the documented `RestBook` schema.
- When filter semantics are verified against seeded data, returned books are consistent with the requested `title` and `author` values.

---

## Test Case ID
POS-BOOKS-GET-005

## Scenario
Retrieve books with empty string query values

## Purpose
Validate that empty strings are accepted as valid string values for documented query parameters because OpenAPI does not define `minLength`.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
```text
title=
author=
```

### Request Body
None

## Expected Status Code
200

## Expected Response
Response body is an array of `RestBook` objects.

## Assertions
- Status code equals `200`.
- Response body is an array.
- Every returned item conforms to the documented `RestBook` schema.

---

# Notes

- OpenAPI does not define exact matching, partial matching, case sensitivity, ordering, sorting, pagination, or search behavior for `title` and `author`; automation must not assume these semantics unless verified by separate product requirements.
- OpenAPI does not document authentication for `GET /books`.
- OpenAPI does not define create/update side effects for this endpoint; persistence checks should be tied to setup data created through documented write operations, not inferred from `GET /books` alone.
