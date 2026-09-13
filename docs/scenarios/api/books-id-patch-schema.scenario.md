# PATCH /books/{id} Schema Validation Scenarios

# Endpoint Information

- Method: PATCH
- Endpoint: /books/{id}
- Description: Partial update of a book. OpenAPI operationId: `partialUpdateBook`. No textual operation description is documented.

# Preconditions

- Base API URL is configured outside this scenario plan.
- A book resource exists and its `id` value is known.
- No authentication requirement is documented in OpenAPI.

# Test Data

- Valid path param `id`: existing book id as integer int64.
- Valid minimal request body: `{}`.
- Valid schema-shaped request body: `{ "metadata": { "source": "contract-test" } }`.
- Required request content type: `application/json`.
- Documented success response status: `200`.
- Documented response content type: `*/*`.
- Documented response schema: generic object with no documented required fields or properties.

# Test Cases

## Test Case ID

PATCH-BOOKS-ID-SCHEMA-001

## Scenario

Validate successful response contract for partial book update.

## Purpose

Confirm that the endpoint returns the documented success status and a JSON-compatible object response for a schema-valid PATCH request.

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
  "metadata": {
    "source": "contract-test"
  }
}
```

## Expected Status Code

200

## Expected Response

- Body is an object.
- Response body properties are not documented by OpenAPI.

## Assertions

- Assert status code is `200`.
- Assert response body is a JSON object.
- Assert response matches documented schema: `type: object`.
- Assert no required response fields are enforced because none are documented.
- Assert no response field type, enum, nullable, array, nested object, date, uuid, pagination, or additionalProperties constraints are enforced because none are documented for the response schema.
- Assert request body conforms to documented schema: `type: object` with additional property values of `type: object`.
- Assert request uses documented content type `application/json`.

## Test Case ID

PATCH-BOOKS-ID-SCHEMA-002

## Scenario

Validate minimal request body accepted by documented PATCH request schema.

## Purpose

Confirm the request body schema has no documented required properties for partial update.

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
{}
```

## Expected Status Code

200

## Expected Response

- Body is an object.

## Assertions

- Assert status code is `200`.
- Assert response body is an object.
- Assert empty object request body is valid against the documented request schema because no required request fields are documented.
- Assert no field-specific book update assertions are performed because PATCH request fields are not documented.

# Notes

- OpenAPI documents `PATCH /books/{id}` for partial book update.
- OpenAPI also documents `PATCH /books/{id}/cover`, but that operation is for cover upload and is not the book partial update operation requested here.
- The PATCH request body is documented only as a generic object with `additionalProperties` of `type: object`; no updateable book field names, field types, enums, nullable fields, formats, or business rules are documented.
- The successful response is documented only as a generic object. No response properties, required fields, headers, pagination metadata, or additionalProperties constraints are documented.
- No authentication requirement is documented.