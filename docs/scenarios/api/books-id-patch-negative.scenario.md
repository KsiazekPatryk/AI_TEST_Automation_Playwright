# PATCH /books/{id} Negative Scenarios and Business Validations

# Endpoint Information

- Method: PATCH
- Endpoint: /books/{id}
- Description: Partial update of a book. OpenAPI operationId: `partialUpdateBook`. No textual operation description is documented.

# Preconditions

- A book resource exists and its `id` value is known for validations that require an existing resource.
- API client can send invalid request variants.
- No authentication requirement is documented in OpenAPI.

# Test Data

- Invalid path param candidate: non-integer id such as `abc`.
- Missing body candidate: request without JSON body.
- Invalid body candidate: JSON value that is not an object, such as `[]`.
- Invalid additional property value candidate: `{ "title": "Updated title" }`, because documented additional property values must be objects.
- Malformed JSON candidate: `{ "metadata": `.
- Documented error status codes: none.
- Documented validation error response schemas: none.

# Test Cases

## Test Case ID

PATCH-BOOKS-ID-NEG-001

## Scenario

Invalid path parameter type is not automation-ready from the current OpenAPI contract.

## Purpose

Capture the documented path parameter constraint without inventing an undocumented error response.

## Request

### Headers

- Content-Type: application/json
- Accept: */*

### Path Params

- id: `abc`, invalid because OpenAPI requires integer int64

### Query Params

- None documented

### Request Body

```json
{}
```

## Expected Status Code

Not documented in OpenAPI.

## Expected Response

- Not documented in OpenAPI.

## Assertions

- Assert request fixture classifies `id=abc` as invalid against the OpenAPI schema before execution.
- Do not assert runtime status code because OpenAPI documents no 4xx or 5xx response for invalid path parameters.
- Do not assert error response body because no error schema is documented.

## Test Case ID

PATCH-BOOKS-ID-NEG-002

## Scenario

Missing request body is not automation-ready from the current OpenAPI contract.

## Purpose

Capture that the request body is documented as required while avoiding an invented error status code.

## Request

### Headers

- Content-Type: application/json
- Accept: */*

### Path Params

- id: existing book id, integer int64, required

### Query Params

- None documented

### Request Body

No request body.

## Expected Status Code

Not documented in OpenAPI.

## Expected Response

- Not documented in OpenAPI.

## Assertions

- Assert the request is invalid against OpenAPI because `requestBody.required` is `true`.
- Do not assert runtime status code because OpenAPI documents no error response for missing request body.
- Do not assert error response body because no validation error schema is documented.

## Test Case ID

PATCH-BOOKS-ID-NEG-003

## Scenario

Invalid request body shape is not automation-ready from the current OpenAPI contract.

## Purpose

Capture the documented body schema constraint: request body must be an object and additional property values must be objects.

## Request

### Headers

- Content-Type: application/json
- Accept: */*

### Path Params

- id: existing book id, integer int64, required

### Query Params

- None documented

### Request Body

```json
{
  "title": "Updated title"
}
```

## Expected Status Code

Not documented in OpenAPI.

## Expected Response

- Not documented in OpenAPI.

## Assertions

- Assert request body is invalid against the documented schema because property `title` has a string value while `additionalProperties` requires object values.
- Do not assert runtime status code because OpenAPI documents no validation error response for schema violations.
- Do not assert any business validation message because none is documented.

## Test Case ID

PATCH-BOOKS-ID-NEG-004

## Scenario

Malformed JSON handling is not automation-ready from the current OpenAPI contract.

## Purpose

Document that malformed JSON is a relevant robustness check, but the expected API response is absent from OpenAPI.

## Request

### Headers

- Content-Type: application/json
- Accept: */*

### Path Params

- id: existing book id, integer int64, required

### Query Params

- None documented

### Request Body

```json
{ "metadata": 
```

## Expected Status Code

Not documented in OpenAPI.

## Expected Response

- Not documented in OpenAPI.

## Assertions

- Assert malformed JSON cannot be validated as a valid `application/json` object request body.
- Do not assert runtime status code because OpenAPI documents no malformed JSON error response.
- Do not assert error response schema or message because none is documented.

# Notes

- OpenAPI documents only a `200` success response for `PATCH /books/{id}`.
- No `400`, `401`, `403`, `404`, `409`, `415`, or `422` responses are documented for this operation.
- No business validation rules, invalid state transitions, authorization rules, not-found behavior, conflict behavior, or validation error schema are documented.
- Negative scenarios therefore capture contract-invalid inputs as pre-execution OpenAPI validation checks and intentionally avoid runtime expected status assertions that would require inventing undocumented behavior.