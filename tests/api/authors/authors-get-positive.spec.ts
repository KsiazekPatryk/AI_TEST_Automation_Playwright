import { test, expect } from '@fixtures/test.fixture';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { AuthorResponse } from '@api/models/author.model';

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

  test('TC-POS-001: should return HTTP 200 and an array for a plain request @smoke', async ({ authorsApiSteps }) => {
    const authors = await authorsApiSteps.getAll();

    expect(Array.isArray(authors)).toBeTruthy();
  });

  test('TC-POS-002: should include a newly created author in the GET /authors listing @regression', async ({ authorsApiSteps }) => {
    const authors = await authorsApiSteps.getAll();
    const found = authors.find(a => a.id === authorA.id);

    expect(found, 'created author should appear in listing').toBeDefined();
    expect(found!.firstName).toBe(authorA.firstName);
    expect(found!.lastName).toBe(authorA.lastName);
  });

  test('TC-POS-003: should return only authors matching the firstName filter @regression', async ({ authorsApiSteps }) => {
    const authors = await authorsApiSteps.getAll({ firstName: 'Jane' });

    expect(authors.length).toBeGreaterThan(0);
    expect(authors.some(a => a.firstName === 'Jane'), 'Author A (Jane Doe) should be in results').toBeTruthy();
    expect(
      authors.every(a => a.firstName !== 'John'),
      'Author B (John Smith) should be excluded by firstName=Jane filter',
    ).toBeTruthy();
  });

  test('TC-POS-004: should return only authors matching the lastName filter @regression', async ({ authorsApiSteps }) => {
    const authors = await authorsApiSteps.getAll({ lastName: 'Doe' });

    expect(authors.length).toBeGreaterThan(0);
    expect(authors.some(a => a.lastName === 'Doe'), 'Author A (Jane Doe) should be in results').toBeTruthy();
    expect(
      authors.every(a => a.lastName !== 'Smith'),
      'Author B (John Smith) should be excluded by lastName=Doe filter',
    ).toBeTruthy();
  });

  test('TC-POS-005: should return only the author matching both firstName and lastName filters @regression', async ({ authorsApiSteps }) => {
    // Create a second Jane to confirm firstName=Jane alone would return both
    const janeSmith = await authorsApiSteps.create({ firstName: 'Jane', lastName: 'Smith' });

    try {
      const authors = await authorsApiSteps.getAll({ firstName: 'Jane', lastName: 'Doe' });

      expect(authors.length).toBeGreaterThan(0);
      expect(
        authors.some(a => a.firstName === 'Jane' && a.lastName === 'Doe'),
        'Author A (Jane Doe) should be in results',
      ).toBeTruthy();
      expect(
        authors.every(a => a.lastName !== 'Smith'),
        'Jane Smith should be excluded by lastName=Doe filter',
      ).toBeTruthy();
    } finally {
      await authorsApiSteps.delete(janeSmith.id);
    }
  });

  test('TC-POS-006: should return consistent results across two consecutive GET /authors calls @smoke', async ({ authorsApiSteps }) => {
    const authors1 = await authorsApiSteps.getAll();
    const authors2 = await authorsApiSteps.getAll();

    expect(authors1.length).toBeGreaterThan(0);
    expect(authors2.length).toBeGreaterThan(0);

    // Verify GET is idempotent: setup authors are present in both calls
    const ids1 = new Set(authors1.map(a => a.id));
    const ids2 = new Set(authors2.map(a => a.id));

    expect(ids1.has(authorA.id), 'authorA should appear in first call').toBeTruthy();
    expect(ids2.has(authorA.id), 'authorA should appear in second call').toBeTruthy();
    expect(ids1.has(authorB.id), 'authorB should appear in first call').toBeTruthy();
    expect(ids2.has(authorB.id), 'authorB should appear in second call').toBeTruthy();
  });

  test('TC-POS-007: should not include a deleted author in the GET /authors listing @regression', async ({ authorsApiSteps }) => {
    const created = await authorsApiSteps.create(getRandomAuthorPayload());
    const capturedId = created.id;

    await authorsApiSteps.delete(capturedId);

    const authors = await authorsApiSteps.getAll();

    expect(
      authors.every(a => a.id !== capturedId),
      `deleted author (id ${capturedId}) should not appear in listing`,
    ).toBeTruthy();
  });
});
