import { test, expect } from '@fixtures/test.fixture';
import { HTTP_204_NO_CONTENT } from '@api/consts/http.status.codes.const';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { z } from 'zod';

const MIN_INT64 = -9223372036854775808n;
const MAX_INT64 = 9223372036854775807n;

function isInt64String(value: string): boolean {
  if (!/^-?\d+$/.test(value)) {
    return false;
  }

  const parsed = BigInt(value);

  return parsed >= MIN_INT64 && parsed <= MAX_INT64;
}

const AuthorIdPathParamSchema = z.union([
  z.number().int().refine((value) => BigInt(value) >= MIN_INT64 && BigInt(value) <= MAX_INT64),
  z.string().refine(isInt64String),
]);

test.describe('DELETE /authors/{id} 204 schema', { tag: ['@api', '@authors', '@schema', '@smoke'] }, () => {
  const createdAuthorIds = new Map<string, number>();

  test.afterEach(async ({ authorsApiSteps }, testInfo) => {
    const createdAuthorId = createdAuthorIds.get(testInfo.testId);

    if (createdAuthorId !== undefined) {
      await authorsApiSteps.delete(createdAuthorId);
      createdAuthorIds.delete(testInfo.testId);
    }
  });

  test('should return documented 204 status with no response content', async ({ authorsApiRequest, authorsApiSteps }, testInfo) => {
    const created = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.set(testInfo.testId, created.id);
    const authorIdResult = AuthorIdPathParamSchema.safeParse(created.id);
    expect(authorIdResult.success).toBe(true);

    const deleteResponse = await authorsApiRequest.delete(created.id);

    expect(deleteResponse.status()).toBe(HTTP_204_NO_CONTENT);
    expect(deleteResponse.headers()['content-type']).toBeUndefined();
    expect(await deleteResponse.text()).toBe('');

    createdAuthorIds.delete(testInfo.testId);
  });

  test('should use the documented integer int64-compatible path parameter schema', async ({ authorsApiRequest, authorsApiSteps }, testInfo) => {
    const created = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.set(testInfo.testId, created.id);
    const authorIdResult = AuthorIdPathParamSchema.safeParse(created.id);

    expect(authorIdResult.success).toBe(true);
    expect(created.id).toBeGreaterThan(0);

    const deleteResponse = await authorsApiRequest.delete(created.id);

    expect(deleteResponse.status()).toBe(HTTP_204_NO_CONTENT);
    expect(deleteResponse.headers()['content-type']).toBeUndefined();
    expect(await deleteResponse.text()).toBe('');

    createdAuthorIds.delete(testInfo.testId);
  });

  test('should not parse or validate a response schema when DELETE returns 204', async ({ authorsApiRequest, authorsApiSteps }, testInfo) => {
    const created = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.set(testInfo.testId, created.id);
    const deleteResponse = await authorsApiRequest.delete(created.id);
    const responseText = await deleteResponse.text();

    expect(deleteResponse.status()).toBe(HTTP_204_NO_CONTENT);
    expect(deleteResponse.headers()['content-type']).toBeUndefined();
    expect(responseText.length).toBe(0);

    createdAuthorIds.delete(testInfo.testId);
  });
});