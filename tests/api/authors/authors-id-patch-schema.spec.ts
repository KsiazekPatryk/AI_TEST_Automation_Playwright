import { getRandomAuthorPayload, getRandomAuthorOverridePayload } from '@api/factories/author.factory';
import { PatchAuthorPayload } from '@api/models/author.model';
import { HTTP_200_OK } from '@api/consts/http.status.codes.const';
import { test, expect } from '@fixtures/test.fixture';
import { parseResponse } from '@utils/parse.response.utils';
import { z } from 'zod';

const JsonObjectSchema = z.object({}).passthrough();
const PatchRequestSchema = z.record(z.string(), JsonObjectSchema);

const schemaCases: ReadonlyArray<{
  readonly name: string;
  readonly payload: PatchAuthorPayload;
  readonly assertResponseShape?: boolean;
  readonly assertIntegerId?: boolean;
  readonly expectedContractDrift?: string;
}> = [
  {
    name: 'should return 200 with a JSON object body [TC-SCHEMA-AUTHORS-ID-PATCH-001]',
    payload: getRandomAuthorOverridePayload({ firstName: { value: 'SchemaFirstName' } }),
    assertResponseShape: true,
    expectedContractDrift: 'Live API returns 400 for OpenAPI-valid object-valued PATCH payload.',
  },
  {
    name: 'should use a numeric integer id path parameter [TC-SCHEMA-AUTHORS-ID-PATCH-002]',
    payload: getRandomAuthorOverridePayload({}),
    assertIntegerId: true,
  },
  {
    name: 'should accept an empty JSON object body [TC-SCHEMA-AUTHORS-ID-PATCH-003]',
    payload: getRandomAuthorOverridePayload({}),
  },
  {
    name: 'should allow additional properties with object values [TC-SCHEMA-AUTHORS-ID-PATCH-004]',
    payload: getRandomAuthorOverridePayload({
      lastName: { value: 'SchemaLastName' },
      metadata: { source: 'contract-test' },
    }),
    expectedContractDrift: 'Live API returns 500 for OpenAPI-valid additional object-valued properties.',
  },
  {
    name: 'should send request body as application/json [TC-SCHEMA-AUTHORS-ID-PATCH-005]',
    payload: getRandomAuthorOverridePayload({ firstName: { value: 'JsonFirstName' } }),
    expectedContractDrift: 'Live API returns 400 for OpenAPI-valid object-valued PATCH payload.',
  },
];

test.describe('PATCH /authors/{id} schema', { tag: ['@api', '@authors', '@schema', '@smoke'] }, () => {
  const createdAuthorIds: number[] = [];

  test.afterEach(async ({ authorsApiSteps }) => {
    for (const authorId of createdAuthorIds.splice(0)) {
      await authorsApiSteps.delete(authorId);
    }
  });

  schemaCases.forEach(({ name, payload, assertResponseShape, assertIntegerId, expectedContractDrift }) => {
    test(name, async ({ authorsApiRequest, authorsApiSteps }) => {
      test.fail(expectedContractDrift !== undefined, expectedContractDrift ?? '');

      const author = await authorsApiSteps.create(getRandomAuthorPayload());
      createdAuthorIds.push(author.id);

      if (assertIntegerId === true) {
        expect(Number.isInteger(author.id)).toBe(true);
      }

      const requestResult = PatchRequestSchema.safeParse(payload);
      expect(requestResult.success, requestResult.success ? '' : JSON.stringify(requestResult.error.issues)).toBe(true);

      const response = await authorsApiRequest.patch(author.id, payload);

      expect(response.status()).toBe(HTTP_200_OK);
      expect(response.headers()['content-type']).toContain('application/json');

      const body = await parseResponse<unknown>(response);
      const result = JsonObjectSchema.safeParse(body);

      expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);

      if (assertResponseShape === true) {
        expect(body).not.toBeNull();
        expect(Array.isArray(body)).toBe(false);
      }
    });
  });
});