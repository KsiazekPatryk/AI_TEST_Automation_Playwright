# DELETE /authors/{id} Negative Scenarios & Business Validations

# Endpoint Information

- Method: DELETE
- Endpoint: `/authors/{id}`
- Description: Deletes an author resource identified by `{id}`. OpenAPI operationId: `deleteById_1`.

# Preconditions

- API server is reachable using the configured base URL.
- Negative scenarios are limited to validations derivable from the OpenAPI contract.
- No specific negative response status codes are documented for this operation.

# Test Data

- Invalid path parameter type: `id` = `abc` because OpenAPI requires `integer`, format `int64`.
- Invalid path parameter format: `id` = `1.5` because OpenAPI requires an integer.
- Missing path parameter: not directly executable against `/authors/{id}` because the documented endpoint requires the path segment.
- Request body: none documented for this operation.
- Auth variants: none documented for this operation.
- Business-rule data: none documented for this operation.

# Test Cases

## Test Case ID

TC-NEG-AUTHORS-DELETE-001

## Scenario

DELETE with non-integer `id` path value.

## Purpose

Validate that automation covers the documented path parameter type constraint without inventing an undocumented error status.

## Request

### Headers

No required headers documented in OpenAPI.

### Path Params

- `id`: `abc` (invalid because documented schema is `integer`, format `int64`).

### Query Params

None.

### Request Body

None.

## Expected Status Code

Not documented in OpenAPI for this invalid request.

## Expected Response

- Error response shape is not documented.
- Automation must not assert a specific status code or error body until the OpenAPI contract defines it.

## Assertions

- Assert the test input violates the documented `id` schema before sending or classifying the request.
- If the request is executed as a contract-gap probe, record the actual status code as observed behavior, not as contract expectation.
- Do not assert `400`, `404`, or any other specific error status because no negative response is documented.

## Test Case ID

TC-NEG-AUTHORS-DELETE-002

## Scenario

DELETE with decimal `id` path value.

## Purpose

Validate coverage for an invalid numeric format against the documented integer path parameter.

## Request

### Headers

No required headers documented in OpenAPI.

### Path Params

- `id`: `1.5` (invalid because documented schema is `integer`, format `int64`).

### Query Params

None.

### Request Body

None.

## Expected Status Code

Not documented in OpenAPI for this invalid request.

## Expected Response

- Error response shape is not documented.
- Automation must not assert a specific status code or error body until the OpenAPI contract defines it.

## Assertions

- Assert the test input violates the documented `id` integer schema.
- If executed, capture actual status and response body as exploratory evidence only.
- Do not assert a specific negative status code because none is documented.

## Test Case ID

TC-NEG-AUTHORS-DELETE-003

## Scenario

DELETE without the required `{id}` path segment.

## Purpose

Document that the OpenAPI contract requires `{id}` in the path and no `DELETE /authors` operation exists.

## Request

### Headers

No required headers documented in OpenAPI.

### Path Params

Missing `id` path segment; request path would be `/authors`, which has no documented DELETE operation.

### Query Params

None.

### Request Body

None.

## Expected Status Code

Not documented in OpenAPI because `DELETE /authors` is not a documented operation.

## Expected Response

- No documented response.
- This is a contract coverage gap, not an executable contract assertion.

## Assertions

- Assert OpenAPI contains `DELETE /authors/{id}`.
- Assert OpenAPI does not contain `DELETE /authors`.
- Do not assert a runtime status code for `DELETE /authors` because the operation is outside the documented contract.

# Notes

- OpenAPI documents no `400`, `401`, `403`, `404`, `409`, or validation-error responses for `DELETE /authors/{id}`.
- OpenAPI documents no authentication or authorization requirements for this operation.
- OpenAPI documents no business rules, dependency constraints, conflict rules, idempotency behavior, malformed body handling, or not-found behavior for this operation.
- Negative scenarios are therefore limited to documented contract constraints and explicit contract-gap notes.