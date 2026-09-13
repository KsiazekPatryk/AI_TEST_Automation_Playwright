import { getRandomAuthorPayload, getRandomAuthorOverridePayload } from '@api/factories/author.factory';
import {
  HTTP_400_BAD_REQUEST,
  HTTP_401_UNAUTHORIZED,
  HTTP_403_FORBIDDEN,
  HTTP_500_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CODE_EXCLUSIVE_MAX,
} from '@api/consts/http.status.codes.const';
import { APIResponse } from '@playwright/test';
import { test, expect } from '@fixtures/test.fixture';
import { parseResponse } from '@utils/parse.response.utils';
import { z } from 'zod';

const Int64PathParamSchema = z.number().int();
const PatchRequestSchema = z.record(z.string(), z.object({}).passthrough());
const ErrorBodySchema = z.object({
  status: z.number().int(),
  error: z.string(),
  message: z.union([z.string(), z.array(z.string())]),
});

type ErrorBody = z.infer<typeof ErrorBodySchema>;

async function expectClientErrorResponse(response: APIResponse): Promise<void> {
  expect(response.status()).toBeGreaterThanOrEqual(HTTP_400_BAD_REQUEST);
  expect(response.status()).toBeLessThan(HTTP_500_INTERNAL_SERVER_ERROR);
  expect(response.headers()['content-type']).toContain('application/json');

  const body = await parseResponse<ErrorBody>(response);
  const result = ErrorBodySchema.safeParse(body);
  expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
  expect(JSON.stringify(body)).not.toMatch(/stack|exception|trace|password|token|secret/i);
}

async function expectUndocumentedNegativeResponse(response: APIResponse, testCaseId: string): Promise<void> {
  const status = response.status();
  const contentType = response.headers()['content-type'] ?? '';
  const bodyText = await response.text();

  test.info().annotations.push({
    type: 'contract-gap',
    description: `${testCaseId} runtime: status=${status}, contentType=${contentType}, body=${bodyText.slice(0, 300)}`,
  });
  await test.info().attach(`${testCaseId}-runtime-response`, {
    body: bodyText,
    contentType: contentType || 'text/plain',
  });

  expect([HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN]).not.toContain(status);
  expect(status).toBeGreaterThanOrEqual(HTTP_400_BAD_REQUEST);
  expect(status).toBeLessThan(HTTP_STATUS_CODE_EXCLUSIVE_MAX);
  expect(contentType).toContain('application/json');
  expect(bodyText).not.toMatch(/stack|exception|trace|password|token|secret/i);
}

test.describe('PATCH /authors/{id} 4xx contract gaps', { tag: ['@api', '@authors', '@regression'] }, () => {
  const createdAuthorIds: number[] = [];

  test.afterEach(async ({ authorsApiSteps }) => {
    for (const authorId of createdAuthorIds.splice(0)) {
      await authorsApiSteps.delete(authorId);
    }
  });

  test('should treat a non-integer id as invalid against the OpenAPI path parameter schema [TC-NEG-AUTHORS-ID-PATCH-001]', async ({
    authorsApiRequest,
  }) => {
    const invalidId = 'abc';
    const pathResult = Int64PathParamSchema.safeParse(invalidId);

    expect(pathResult.success).toBe(false);

    const response = await authorsApiRequest.patch(invalidId, getRandomAuthorOverridePayload({}));

    await expectClientErrorResponse(response);
  });

  test('should treat a missing body as invalid because requestBody is required [TC-NEG-AUTHORS-ID-PATCH-002]', async ({
    authorsApiRequest,
    authorsApiSteps,
  }) => {
    const author = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.push(author.id);

    const response = await authorsApiRequest.patch(author.id);

    await expectUndocumentedNegativeResponse(response, 'TC-NEG-AUTHORS-ID-PATCH-002');
  });

  test('should reject an array body against the documented object request schema [TC-NEG-AUTHORS-ID-PATCH-003]', async ({
    authorsApiRequest,
    authorsApiSteps,
  }) => {
    const author = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.push(author.id);
    const payload = [getRandomAuthorOverridePayload({ firstName: { value: 'ArrayFirstName' } })];

    const requestResult = PatchRequestSchema.safeParse(payload);
    expect(requestResult.success).toBe(false);

    const response = await authorsApiRequest.patch(author.id, payload);

    await expectClientErrorResponse(response);
  });

  test('should reject a string-valued additional property against the documented request schema [TC-NEG-AUTHORS-ID-PATCH-004]', async ({
    authorsApiRequest,
    authorsApiSteps,
  }) => {
    test.fail(true, 'Live API returns 200 for an OpenAPI-invalid string-valued PATCH property.');

    const author = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.push(author.id);
    const payload = getRandomAuthorOverridePayload({ firstName: 'InvalidStringValue' });

    const requestResult = PatchRequestSchema.safeParse(payload);
    expect(requestResult.success).toBe(false);

    const response = await authorsApiRequest.patch(author.id, payload);

    await expectClientErrorResponse(response);
  });

  test('should reject a null-valued additional property against the documented request schema [TC-NEG-AUTHORS-ID-PATCH-005]', async ({
    authorsApiRequest,
    authorsApiSteps,
  }) => {
    const author = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.push(author.id);
    const payload = getRandomAuthorOverridePayload({ firstName: null });

    const requestResult = PatchRequestSchema.safeParse(payload);
    expect(requestResult.success).toBe(false);

    const response = await authorsApiRequest.patch(author.id, payload);

    await expectClientErrorResponse(response);
  });

  test('should reject malformed JSON because it cannot satisfy the documented request schema [TC-NEG-AUTHORS-ID-PATCH-006]', async ({
    authorsApiRequest,
    authorsApiSteps,
  }) => {
    const author = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.push(author.id);
    const malformedJson = '{ "firstName": { "value": "Jane" }';

    expect(() => JSON.parse(malformedJson)).toThrow();

    const response = await authorsApiRequest.patch(author.id, malformedJson);

    await expectClientErrorResponse(response);
  });
});