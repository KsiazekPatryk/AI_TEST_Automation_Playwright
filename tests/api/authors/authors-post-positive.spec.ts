import { test, expect } from '@fixtures/test.fixture';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { AuthorResponse } from '@api/models/author.model';
import { parseResponse } from '@utils/parse.response.utils';
import { HTTP_201_CREATED, HTTP_200_OK } from '@api/consts/http.status.codes.const';

test.describe('POST /authors — positive scenarios', { tag: ['@api', '@authors', '@smoke'] }, () => {
  const createdIds: number[] = [];

  test.afterEach(async ({ authorsApiSteps }) => {
    for (const id of createdIds) {
      await authorsApiSteps.delete(id);
    }
    createdIds.length = 0;
  });

  test('should create an author and return 201 with application/json content-type', async ({ authorsApiRequest }) => {
    const payload = getRandomAuthorPayload();

    const response = await test.step('POST /authors', () => authorsApiRequest.create(payload));

    await test.step('assert status and headers', () => {
      expect(response.status()).toBe(HTTP_201_CREATED);
      expect(response.headers()['content-type']).toContain('application/json');
    });

    const body = await parseResponse<AuthorResponse>(response);
    createdIds.push(body.id);

    await test.step('assert response body fields', () => {
      expect(body.id).toBeGreaterThan(0);
      expect(typeof body.id).toBe('number');
      expect(body.firstName).toBe(payload.firstName);
      expect(body.lastName).toBe(payload.lastName);
    });
  });

  test('should echo back the submitted firstName and lastName in the response', async ({ authorsApiRequest }) => {
    const payload = getRandomAuthorPayload();

    const response = await test.step('POST /authors', () => authorsApiRequest.create(payload));

    expect(response.status()).toBe(HTTP_201_CREATED);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await parseResponse<AuthorResponse>(response);
    createdIds.push(body.id);

    await test.step('assert echoed values', () => {
      expect(body.firstName).toBe(payload.firstName);
      expect(body.lastName).toBe(payload.lastName);
    });
  });

  test('should persist the created author and make it retrievable by GET /authors/:id', async ({ authorsApiRequest }) => {
    const payload = getRandomAuthorPayload();

    const createResponse = await test.step('POST /authors', () => authorsApiRequest.create(payload));

    expect(createResponse.status()).toBe(HTTP_201_CREATED);
    expect(createResponse.headers()['content-type']).toContain('application/json');

    const created = await parseResponse<AuthorResponse>(createResponse);
    createdIds.push(created.id);

    const getResponse = await test.step(`GET /authors/${created.id}`, () =>
      authorsApiRequest.getById(created.id),
    );

    await test.step('assert retrieved author matches created author', () => {
      expect(getResponse.status()).toBe(HTTP_200_OK);
    });

    const retrieved = await parseResponse<AuthorResponse>(getResponse);

    await test.step('assert field values match', () => {
      expect(retrieved.id).toBe(created.id);
      expect(retrieved.firstName).toBe(payload.firstName);
      expect(retrieved.lastName).toBe(payload.lastName);
    });
  });

  test('should assign unique IDs to two consecutively created authors', async ({ authorsApiRequest }) => {
    const payload1 = getRandomAuthorPayload();
    const payload2 = getRandomAuthorPayload();

    const [response1, response2] = await test.step('POST /authors (two requests)', async () => {
      const r1 = await authorsApiRequest.create(payload1);
      const r2 = await authorsApiRequest.create(payload2);
      return [r1, r2] as const;
    });

    expect(response1.status()).toBe(HTTP_201_CREATED);
    expect(response2.status()).toBe(HTTP_201_CREATED);

    const [body1, body2] = await Promise.all([
      parseResponse<AuthorResponse>(response1),
      parseResponse<AuthorResponse>(response2),
    ]);

    createdIds.push(body1.id, body2.id);

    await test.step('assert IDs are distinct positive integers', () => {
      expect(body1.id).toBeGreaterThan(0);
      expect(body2.id).toBeGreaterThan(0);
      expect(body1.id).not.toBe(body2.id);
    });
  });

  test('should create an author with a hyphenated name', async ({ authorsApiRequest }) => {
    const payload = getRandomAuthorPayload({ firstName: 'Jean-Paul', lastName: 'Sartre' });

    const response = await test.step('POST /authors', () => authorsApiRequest.create(payload));

    expect(response.status()).toBe(HTTP_201_CREATED);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await parseResponse<AuthorResponse>(response);
    createdIds.push(body.id);

    await test.step('assert hyphenated name is preserved', () => {
      expect(body.firstName).toBe('Jean-Paul');
      expect(body.lastName).toBe('Sartre');
    });
  });

});

