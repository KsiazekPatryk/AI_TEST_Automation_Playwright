import { getRandomAuthorPayload, getRandomAuthorOverridePayload } from '@api/factories/author.factory';
import { PatchAuthorPayload } from '@api/models/author.model';
import { HTTP_200_OK } from '@api/consts/http.status.codes.const';
import { test, expect } from '@fixtures/test.fixture';
import { parseResponse } from '@utils/parse.response.utils';
import { z } from 'zod';

const JsonObjectSchema = z.object({}).passthrough();
const PatchRequestSchema = z.record(z.string(), JsonObjectSchema);

const positiveCases: ReadonlyArray<{
  readonly name: string;
  readonly payload: PatchAuthorPayload;
  readonly assertArrayShape?: boolean;
  readonly expectedContractDrift?: string;
}> = [
  {
    name: 'should partially update an existing author with one object-valued property [TC-POS-AUTHORS-ID-PATCH-001]',
    payload: getRandomAuthorOverridePayload({ firstName: { value: 'PatchedFirstName' } }),
    assertArrayShape: true,
    expectedContractDrift: 'Live API returns 400 for OpenAPI-valid object-valued PATCH payload.',
  },
  {
    name: 'should partially update an existing author with multiple object-valued properties [TC-POS-AUTHORS-ID-PATCH-002]',
    payload: getRandomAuthorOverridePayload({
      firstName: { value: 'PatchedFirstName' },
      lastName: { value: 'PatchedLastName' },
    }),
    expectedContractDrift: 'Live API returns 400 for OpenAPI-valid object-valued PATCH payload.',
  },
  {
    name: 'should accept an empty object body [TC-POS-AUTHORS-ID-PATCH-003]',
    payload: getRandomAuthorOverridePayload({}),
  },
  {
    name: 'should accept an undocumented object-valued property [TC-POS-AUTHORS-ID-PATCH-004]',
    payload: getRandomAuthorOverridePayload({ metadata: { source: 'api-contract' } }),
    expectedContractDrift: 'Live API returns 500 for OpenAPI-valid arbitrary object-valued additional property.',
  },
];

test.describe('PATCH /authors/{id} 2xx', { tag: ['@api', '@authors', '@smoke'] }, () => {
  const createdAuthorIds: number[] = [];

  test.afterEach(async ({ authorsApiSteps }) => {
    for (const authorId of createdAuthorIds.splice(0)) {
      await authorsApiSteps.delete(authorId);
    }
  });

  positiveCases.forEach(({ name, payload, assertArrayShape, expectedContractDrift }) => {
    test(name, async ({ authorsApiRequest, authorsApiSteps }) => {
      test.fail(expectedContractDrift !== undefined, expectedContractDrift ?? '');

      const author = await authorsApiSteps.create(getRandomAuthorPayload());
      createdAuthorIds.push(author.id);

      const requestResult = PatchRequestSchema.safeParse(payload);
      expect(requestResult.success, requestResult.success ? '' : JSON.stringify(requestResult.error.issues)).toBe(true);

      const response = await authorsApiRequest.patch(author.id, payload);

      expect(response.status()).toBe(HTTP_200_OK);
      expect(response.headers()['content-type']).toContain('application/json');

      const body = await parseResponse<unknown>(response);
      const result = JsonObjectSchema.safeParse(body);

      expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
      expect(body).not.toBeNull();

      if (assertArrayShape === true) {
        expect(Array.isArray(body)).toBe(false);
      }
    });
  });
});