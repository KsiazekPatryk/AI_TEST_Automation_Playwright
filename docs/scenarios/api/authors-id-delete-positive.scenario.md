# DELETE /authors/{id} Positive Scenarios

# Endpoint Information

- Method: DELETE
- Endpoint: `/authors/{id}`
- Description: Deletes an author resource identified by `{id}`. OpenAPI operationId: `deleteById_1`.

# Preconditions

- API server is reachable using the configured base URL.
- A disposable author exists before each delete scenario.
- The disposable author ID is obtained during test setup and is used as the `{id}` path parameter.
- Test data is isolated so deleting the author does not affect other scenarios.

# Test Data

- Valid path parameter: `id` = existing author ID, type `integer`, format `int64`.
- Request body: none documented for this operation.
- Query parameters: none documented for this operation.
- Successful response status: `204`.

# Test Cases

## Test Case ID

TC-POS-AUTHORS-DELETE-001

## Scenario

Delete an existing author by ID.

## Purpose

Validate the documented successful deletion behavior for an existing author resource.

## Request

### Headers

No required headers documented in OpenAPI.

### Path Params

- `id`: existing author ID, integer, int64.

### Query Params

None.

### Request Body

None.

## Expected Status Code

`204`

## Expected Response

- Response status is `204 No Content`.
- Response body is empty.

## Assertions

- Assert response status equals `204`.
- Assert response body is empty.
- Assert no JSON response fields are required or validated.

## Test Case ID

TC-POS-AUTHORS-DELETE-002

## Scenario

Delete author using an int64-compatible path parameter value.

## Purpose

Validate that a valid numeric author ID satisfying the path parameter schema can be used for deletion.

## Request

### Headers

No required headers documented in OpenAPI.

### Path Params

- `id`: existing author ID, integer, int64.

### Query Params

None.

### Request Body

None.

## Expected Status Code

`204`

## Expected Response

- Response status is `204 No Content`.
- Response body is empty.

## Assertions

- Assert the request URL includes the numeric author ID in `/authors/{id}`.
- Assert response status equals `204`.
- Assert response body is empty.

# Notes

- OpenAPI documents only the DELETE operation itself. It does not document post-delete verification behavior through `GET /authors/{id}`, so persistence/not-found verification after deletion is intentionally excluded from positive scenarios.
- OpenAPI does not document idempotency for repeated DELETE calls, so repeated deletion is intentionally excluded.
- OpenAPI does not document request headers, authentication, query parameters, or request body for this operation.