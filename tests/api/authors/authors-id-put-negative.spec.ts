import { test, expect } from '@fixtures/test.fixture';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { HTTP_400_BAD_REQUEST } from '@api/consts/http.status.codes.const';
import { parseResponse } from '@utils/parse.response.utils';

type ErrorBody = {
  status: number;
  error: string;
  message: unknown;
};

test.describe('PUT /authors/{id} 4xx', { tag: ['@api', '@authors', '@regression'] }, () => {
  let authorId: number;

  test.beforeEach(async ({ authorsApiSteps }) => {
    const author = await authorsApiSteps.create(getRandomAuthorPayload());
    authorId = author.id;
  });

  test.afterEach(async ({ authorsApiSteps }) => {
    if (authorId) {
      await authorsApiSteps.delete(authorId);
    }
  });

  test('should return 400 when only firstName is provided', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.update(authorId, { firstName: 'Charlotte' });

    expect(response.status()).toBe(HTTP_400_BAD_REQUEST);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await parseResponse<ErrorBody>(response);
    expect(body.status).toBe(HTTP_400_BAD_REQUEST);
    expect(typeof body.error).toBe('string');
    expect(Array.isArray(body.message)).toBe(true);
  });

  test('should return 400 when only lastName is provided', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.update(authorId, { lastName: 'Bronte' });

    expect(response.status()).toBe(HTTP_400_BAD_REQUEST);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await parseResponse<ErrorBody>(response);
    expect(body.status).toBe(HTTP_400_BAD_REQUEST);
    expect(typeof body.error).toBe('string');
    expect(Array.isArray(body.message)).toBe(true);
  });
});
