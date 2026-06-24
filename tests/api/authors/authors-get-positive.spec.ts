import { test, expect } from '@fixtures/test.fixture';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { AuthorResponse } from '@api/models/author.model';

// Note: fakerestapi ignores query filter parameters — GET /authors always returns all authors
// regardless of firstName / lastName params. TC-POS-003, TC-POS-004, TC-POS-005 verify the
// endpoint accepts filter params without error and includes the expected authors in results.
// Exclusion assertions are intentionally omitted.

test.describe('GET /authors — positive scenarios @api @authors', () => {
  let authorA: AuthorResponse;
  let authorB: AuthorResponse;

  test.beforeAll(async ({ authorsApiSteps }) => {
    authorA = await authorsApiSteps.create({ firstName: 'Jane', lastName: 'Doe' });
    authorB = await authorsApiSteps.create({ firstName: 'John', lastName: 'Smith' });
  });

  test.afterAll(async ({ authorsApiSteps }) => {
    await authorsApiSteps.delete(authorA.id);
    await authorsApiSteps.delete(authorB.id);
  });

  test('TC-POS-001: should return HTTP 200, application/json content-type, and a schema-valid array @smoke', async ({ authorsApiSteps }) => {
    // getAll() validates: status 200, content-type application/json, Zod schema
    const authors = await authorsApiSteps.getAll();

    expect(authors).toBeInstanceOf(Array);
  });

  test('TC-POS-002: should include a newly created author in the GET /authors listing @regression', async ({ authorsApiSteps }) => {
    const authors = await test.step('GET /authors', () => authorsApiSteps.getAll());
    const found = authors.find(a => a.id === authorA.id);

    await test.step('assert created author is present with correct data', () => {
      expect(found, 'created author should appear in listing').toBeDefined();
      expect(found!.firstName).toBe(authorA.firstName);
      expect(found!.lastName).toBe(authorA.lastName);
    });
  });

  test('TC-POS-003: should return HTTP 200 with a valid response when firstName query param is provided @regression', async ({ authorsApiSteps }) => {
    const authors = await test.step('GET /authors?firstName=Jane', () =>
      authorsApiSteps.getAll({ firstName: 'Jane' }),
    );

    await test.step('assert Author A is present in results', () => {
      expect(authors.length).toBeGreaterThan(0);
      expect(authors.some(a => a.firstName === 'Jane'), 'Author A (Jane Doe) should be in results').toBe(true);
    });
  });

  test('TC-POS-004: should return HTTP 200 with a valid response when lastName query param is provided @regression', async ({ authorsApiSteps }) => {
    const authors = await test.step('GET /authors?lastName=Doe', () =>
      authorsApiSteps.getAll({ lastName: 'Doe' }),
    );

    await test.step('assert Author A is present in results', () => {
      expect(authors.length).toBeGreaterThan(0);
      expect(authors.some(a => a.lastName === 'Doe'), 'Author A (Jane Doe) should be in results').toBe(true);
    });
  });

  test('TC-POS-005: should return HTTP 200 with a valid response when both firstName and lastName params are provided @regression', async ({ authorsApiSteps }) => {
    const janeSmith = await authorsApiSteps.create({ firstName: 'Jane', lastName: 'Smith' });

    try {
      const authors = await test.step('GET /authors?firstName=Jane&lastName=Doe', () =>
        authorsApiSteps.getAll({ firstName: 'Jane', lastName: 'Doe' }),
      );

      await test.step('assert Author A (Jane Doe) is present in results', () => {
        expect(authors.length).toBeGreaterThan(0);
        expect(
          authors.some(a => a.firstName === 'Jane' && a.lastName === 'Doe'),
          'Author A (Jane Doe) should be in results',
        ).toBe(true);
      });
    } finally {
      await authorsApiSteps.delete(janeSmith.id);
    }
  });

  test('TC-POS-006: should return consistent results across two consecutive GET /authors calls @smoke', async ({ authorsApiSteps }) => {
    const [authors1, authors2] = await test.step('send two consecutive GET /authors requests', async () => {
      const r1 = await authorsApiSteps.getAll();
      const r2 = await authorsApiSteps.getAll();
      return [r1, r2] as const;
    });

    await test.step('assert both responses contain the setup authors', () => {
      expect(authors1.length).toBeGreaterThan(0);
      expect(authors2.length).toBeGreaterThan(0);

      const ids1 = new Set(authors1.map(a => a.id));
      const ids2 = new Set(authors2.map(a => a.id));

      expect(ids1.has(authorA.id), 'authorA should appear in first call').toBe(true);
      expect(ids2.has(authorA.id), 'authorA should appear in second call').toBe(true);
      expect(ids1.has(authorB.id), 'authorB should appear in first call').toBe(true);
      expect(ids2.has(authorB.id), 'authorB should appear in second call').toBe(true);
    });
  });

  test('TC-POS-007: should not include a deleted author in the GET /authors listing @regression', async ({ authorsApiSteps }) => {
    const created = await test.step('create a temporary author', () =>
      authorsApiSteps.create(getRandomAuthorPayload()),
    );

    await test.step('delete the temporary author', () => authorsApiSteps.delete(created.id));

    const authors = await test.step('GET /authors', () => authorsApiSteps.getAll());

    await test.step('assert deleted author is absent from listing', () => {
      expect(
        authors.every(a => a.id !== created.id),
        `deleted author (id ${created.id}) should not appear in listing`,
      ).toBe(true);
    });
  });
});
