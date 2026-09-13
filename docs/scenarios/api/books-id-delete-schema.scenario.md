# DELETE /books/{id} Schema Validation

# Endpoint Information

- Method: DELETE
- Endpoint: `/books/{id}`
- Description: Deletes a book resource identified by `{id}`. OpenAPI operationId: `deleteById`.

# Preconditions

- API server is reachable using the configured base URL.
- A book resource exists and its numeric `id` is known before executing the delete request.
- The book used for deletion is isolated test data created before the scenario.

# Test Data

- Valid path parameter: `id` = existing book ID, type `integer`, format `int64`.
- Request body: none documented for this operation.
- Query parameters: none documented for this operation.
- Headers: no required request headers documented for this operation.

# Test Cases

## Test Case ID

TC-SCHEMA-BOOKS-ID-DELETE-001

## Scenario

Successful delete returns documented status code.

## Purpose

Validate that the DELETE operation follows the documented success response contract.

## Request

### Headers

No required headers documented in OpenAPI.

### Path Params

- `id`: existing book ID, integer, int64.

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
- Assert response is not parsed as a book object, array, or primitive JSON value.

## Test Case ID

TC-SCHEMA-BOOKS-ID-DELETE-002

## Scenario

DELETE request uses the documented path parameter schema.

## Purpose

Validate that the request path parameter conforms to the OpenAPI contract.

## Request

### Headers

No required headers documented in OpenAPI.

### Path Params

- `id`: existing book ID, integer, int64.

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

- Assert `id` test value is an integer.
- Assert `id` test value is within int64-compatible numeric range for the automation stack.
- Assert response status equals `204`.
- Assert no response schema validation is attempted because OpenAPI documents no response content for `204`.

## Test Case ID

TC-SCHEMA-BOOKS-ID-DELETE-003

## Scenario

DELETE response has no documented content schema.

## Purpose

Validate that automation does not expect fields or a JSON body for the documented `204` response.

## Request

### Headers

No required headers documented in OpenAPI.

### Path Params

- `id`: existing book ID, integer, int64.

### Query Params

None.

### Request Body

None.

## Expected Status Code

`204`

## Expected Response

- No response body.
- No `Book` schema, object schema, array schema, pagination metadata, enum fields, nullable fields, or nested objects are documented for this response.

## Assertions

- Assert response status equals `204`.
- Assert response body length is `0` or equivalent empty representation in the test client.
- Assert no required response fields are validated because none are documented.
- Assert no response enum validation is performed because none is documented.

# Notes

- OpenAPI documents book deletion as `DELETE /books/{id}`.
- OpenAPI also documents `DELETE /books/{id}/cover`, but that operation removes a book cover and is intentionally excluded from this book deletion plan.
- Only `204 No Content` is documented for `DELETE /books/{id}`.
- No response headers, response content type, response schema, authentication requirements, query parameters, request body, nullable fields, enums, pagination, or `additionalProperties` rules are documented for this operation.