# Negative Scenarios — GET /books

---

# Endpoint Information

- **Method:** GET
- **Endpoint:** /books
- **Description:** Returns a list of books. Supports optional filtering by `title` and `author` query parameters.

---

# Preconditions

- API server is running and reachable using the configured API base URL.
- No authentication requirement is documented in OpenAPI for this operation.
- OpenAPI documents only one response for this operation: `200 OK`.

---

# Test Data

**Valid headers:**
```http
Accept: application/json
```

**Negative-like but contract-valid query values:**
```text
title=__nonexistent_book_title_12345__
author=__nonexistent_author_name_12345__
```

**Request body:** None. `GET /books` has no documented request body.

**Documented error responses:** None.

---

# Test Cases

---

## Test Case ID
NEG-BOOKS-GET-001

## Scenario
Filter by a title value that is unlikely to match existing books

## Purpose
Validate robustness for a valid string `title` query parameter value while staying inside the documented OpenAPI contract. OpenAPI does not define a separate error response for no matches.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
```text
title=__nonexistent_book_title_12345__
```

### Request Body
None

## Expected Status Code
200

## Expected Response
Response body is an array of `RestBook` objects. The array may be empty or populated depending on undocumented filter semantics and data state.

## Assertions
- Status code equals `200`.
- Response body is an array.
- Every returned item conforms to the documented `RestBook` schema.
- Do not assert `404`, `400`, or empty array behavior because OpenAPI does not document these outcomes for no-match filters.

---

## Test Case ID
NEG-BOOKS-GET-002

## Scenario
Filter by an author value that is unlikely to match existing books

## Purpose
Validate robustness for a valid string `author` query parameter value while staying inside the documented OpenAPI contract. OpenAPI does not define a separate error response for no matches.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
```text
author=__nonexistent_author_name_12345__
```

### Request Body
None

## Expected Status Code
200

## Expected Response
Response body is an array of `RestBook` objects. The array may be empty or populated depending on undocumented filter semantics and data state.

## Assertions
- Status code equals `200`.
- Response body is an array.
- Every returned item conforms to the documented `RestBook` schema.
- Do not assert `404`, `400`, or empty array behavior because OpenAPI does not document these outcomes for no-match filters.

---

## Test Case ID
NEG-BOOKS-GET-003

## Scenario
Use both documented filters with values unlikely to match the same book

## Purpose
Validate robust handling of combined valid string query parameters without assuming undocumented filtering logic.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
```text
title=__nonexistent_book_title_12345__
author=__nonexistent_author_name_12345__
```

### Request Body
None

## Expected Status Code
200

## Expected Response
Response body is an array of `RestBook` objects. No error response is documented for unmatched or combined filters.

## Assertions
- Status code equals `200`.
- Response body is an array.
- Every returned item conforms to the documented `RestBook` schema.
- Do not assert exact result count because OpenAPI does not define filter matching semantics.

---

## Test Case ID
NEG-BOOKS-GET-004

## Scenario
Verify documented negative response contract is absent

## Purpose
Prevent automation from asserting undocumented error behavior for `GET /books`.

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
The only documented response is `200 OK` with an array of `RestBook` objects.

## Assertions
- Status code equals `200` for the documented base request.
- Response body is an array.
- Do not create negative assertions for missing required fields because the operation has no request body.
- Do not create invalid path parameter assertions because `/books` has no path parameters.
- Do not create invalid enum assertions because this operation has no enum parameters or enum fields.
- Do not create unauthorized or forbidden assertions because OpenAPI does not document authentication or `401`/`403` responses.
- Do not create not-found assertions because OpenAPI does not document `404` for the collection endpoint.

---

# Notes

- OpenAPI documents no negative status codes, validation error schema, authentication requirement, required query parameters, path parameters, request body, enum constraints, regex patterns, min/max constraints, or pagination constraints for `GET /books`.
- `title` and `author` are optional strings with no documented `minLength`, `maxLength`, `pattern`, or enum. Empty strings and arbitrary strings are contract-valid from the OpenAPI perspective.
- Malformed JSON is not applicable because this operation has no documented request body.
- Unknown query parameter handling is not documented; no automation-ready expected status code can be derived from OpenAPI for that case.
