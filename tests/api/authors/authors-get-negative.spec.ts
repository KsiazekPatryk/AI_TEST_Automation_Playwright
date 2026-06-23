import { test, expect } from '@fixtures/test.fixture';
import { API_ENDPOINTS } from '@api/consts/api.endpoints.const';
import { AuthorResponse } from '@api/models/author.model';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { parseResponse } from '@utils/parse.response.utils';
import {
  HTTP_200_OK,
  HTTP_405_METHOD_NOT_ALLOWED,
  HTTP_406_NOT_ACCEPTABLE,
} from '@api/consts/http.status.codes.const';

test.describe('GET /authors — negative scenarios @api @authors @regression', () => {
  // TC-NEG-003 requires Jane Doe and John Smith to exist so that:
  //   firstName=Jane       → returns Jane Doe   (Jane exists as a first name)
  //   lastName=Smith       → returns John Smith  (Smith exists as a last name)
  //   firstName=Jane&lastName=Smith → [] (no author named Jane Smith)
  let janeDoeId: number | undefined;
  let johnSmithId: number | undefined;

  test.beforeAll(async ({ authorsApiSteps }) => {
    const janeDoe = await authorsApiSteps.create(getRandomAuthorPayload({ firstName: 'Jane', lastName: 'Doe' }));
    janeDoeId = janeDoe.id;

    const johnSmith = await authorsApiSteps.create(getRandomAuthorPayload({ firstName: 'John', lastName: 'Smith' }));
    johnSmithId = johnSmith.id;
  });

  test.afterAll(async ({ authorsApiSteps }) => {
    if (janeDoeId !== undefined) {
      await authorsApiSteps.delete(janeDoeId);
      janeDoeId = undefined;
    }
    if (johnSmithId !== undefined) {
      await authorsApiSteps.delete(johnSmithId);
      johnSmithId = undefined;
    }
  });

  test('should return 200 and empty array when firstName filter matches no author', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.getAll({ firstName: '__nonexistent_xyz_12345__' });

    expect(response.status()).toBe(HTTP_200_OK);

    const body = await parseResponse<AuthorResponse[]>(response);

    expect(Array.isArray(body)).toBeTruthy();
    expect(body).toEqual([]);
  });

  test('should return 200 and empty array when lastName filter matches no author', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.getAll({ lastName: '__nonexistent_xyz_12345__' });

    expect(response.status()).toBe(HTTP_200_OK);

    const body = await parseResponse<AuthorResponse[]>(response);

    expect(Array.isArray(body)).toBeTruthy();
    expect(body).toEqual([]);
  });

  test('should return 200 and empty array when combined firstName+lastName filter matches no author', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.getAll({ firstName: 'Jane', lastName: 'Smith' });

    expect(response.status()).toBe(HTTP_200_OK);

    const body = await parseResponse<AuthorResponse[]>(response);

    expect(Array.isArray(body)).toBeTruthy();
    expect(body).toEqual([]);
  });

  test('should return 200 and non-empty array when unknown query param is provided', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.getAll({ foo: 'bar' });

    expect(response.status()).toBe(HTTP_200_OK);

    const body = await parseResponse<AuthorResponse[]>(response);

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('should return 405 when DELETE is sent to /authors collection without an id', async ({ apiRequest }) => {
    const response = await apiRequest.delete(API_ENDPOINTS.authors.base);

    expect(response.status()).toBe(HTTP_405_METHOD_NOT_ALLOWED);
  });

  test('should return 405 when PUT is sent to /authors collection without an id', async ({ apiRequest }) => {
    const response = await apiRequest.put(API_ENDPOINTS.authors.base, getRandomAuthorPayload());

    expect(response.status()).toBe(HTTP_405_METHOD_NOT_ALLOWED);
  });

  test('should return 406 when Accept: application/xml header is sent', async ({ apiRequest }) => {
    const response = await apiRequest.get(API_ENDPOINTS.authors.base, undefined, { Accept: 'application/xml' });

    expect(response.status()).toBe(HTTP_406_NOT_ACCEPTABLE);
  });

  test('should return 200 and an array when firstName query param is an empty string', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.getAll({ firstName: '' });

    expect(response.status()).toBe(HTTP_200_OK);

    const body = await parseResponse<AuthorResponse[]>(response);

    expect(Array.isArray(body)).toBeTruthy();
  });
});
