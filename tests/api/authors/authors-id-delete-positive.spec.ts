import { test, expect } from '@fixtures/test.fixture';
import { HTTP_204_NO_CONTENT } from '@api/consts/http.status.codes.const';
import { getRandomAuthorPayload } from '@api/factories/author.factory';

test.describe('DELETE /authors/{id} 2xx', { tag: ['@api', '@authors', '@smoke'] }, () => {
  const createdAuthorIds = new Map<string, number>();

  test.afterEach(async ({ authorsApiSteps }, testInfo) => {
    const createdAuthorId = createdAuthorIds.get(testInfo.testId);

    if (createdAuthorId !== undefined) {
      await authorsApiSteps.delete(createdAuthorId);
      createdAuthorIds.delete(testInfo.testId);
    }
  });

  test('should delete an existing author by ID and return 204 with empty body', async ({ authorsApiRequest, authorsApiSteps }, testInfo) => {
    const created = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.set(testInfo.testId, created.id);
    expect(Number.isInteger(created.id)).toBe(true);

    const deleteResponse = await authorsApiRequest.delete(created.id);

    expect(deleteResponse.status()).toBe(HTTP_204_NO_CONTENT);
    expect(deleteResponse.headers()['content-type']).toBeUndefined();
    expect(await deleteResponse.text()).toBe('');

    createdAuthorIds.delete(testInfo.testId);
  });

  test('should delete an author using an int64-compatible numeric path parameter', async ({ authorsApiRequest, authorsApiSteps }, testInfo) => {
    const created = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.set(testInfo.testId, created.id);
    const authorId = created.id;

    expect(Number.isInteger(authorId)).toBe(true);
    expect(Number.isSafeInteger(authorId)).toBe(true);

    const deleteResponse = await authorsApiRequest.delete(authorId);

    expect(deleteResponse.status()).toBe(HTTP_204_NO_CONTENT);
    expect(deleteResponse.headers()['content-type']).toBeUndefined();
    expect(await deleteResponse.text()).toBe('');

    createdAuthorIds.delete(testInfo.testId);
  });
});