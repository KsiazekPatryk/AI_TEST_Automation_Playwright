import { test, expect } from '@fixtures/test.fixture';
import { getRandomAuthorPayload, getRandomAuthorOverridePayload } from '@api/factories/author.factory';
import { AuthorResponse } from '@api/models/author.model';

test.describe('PUT /authors/{id} 2xx', { tag: ['@api', '@authors', '@smoke'] }, () => {
  let author: AuthorResponse;

  test.beforeEach(async ({ authorsApiSteps }) => {
    author = await authorsApiSteps.create(getRandomAuthorPayload());
  });

  test.afterEach(async ({ authorsApiSteps }) => {
    if (author?.id) {
      await authorsApiSteps.delete(author.id);
    }
  });

  // TC-POS-001
  test('TC-POS-001: should update author with both firstName and lastName and return 200', async ({ authorsApiSteps }) => {
    const payload = getRandomAuthorOverridePayload({ firstName: 'Jane', lastName: 'Austen' });
    const updated = await authorsApiSteps.update(author.id, payload);

    expect(updated.id).toBe(author.id);
    expect(updated.firstName).toBe('Jane');
    expect(updated.lastName).toBe('Austen');
  });

  // TC-POS-004
  test('TC-POS-004: should persist updated values — GET after PUT reflects new data', async ({ authorsApiSteps }) => {
    const payload = getRandomAuthorOverridePayload({ firstName: 'Emily', lastName: 'Dickinson' });
    await authorsApiSteps.update(author.id, payload);

    const fetched = await authorsApiSteps.getById(author.id);

    expect(fetched.firstName).toBe('Emily');
    expect(fetched.lastName).toBe('Dickinson');
  });

  // TC-POS-005
  test('TC-POS-005: should accept Unicode / non-ASCII characters in name fields and return 200', async ({ authorsApiSteps }) => {
    const payload = getRandomAuthorOverridePayload({ firstName: 'Søren', lastName: 'Kierkegaard' });
    await authorsApiSteps.update(author.id, payload);
    const fetched = await authorsApiSteps.getById(author.id);

    expect(fetched.firstName).toBe('Søren');
    expect(fetched.lastName).toBe('Kierkegaard');
  });

  // TC-POS-006
  test('TC-POS-006: should be idempotent — same PUT twice both return 200 and state matches last PUT', async ({ authorsApiSteps }) => {
    const payload = getRandomAuthorOverridePayload({ firstName: 'Leo', lastName: 'Tolstoy' });
    const first = await authorsApiSteps.update(author.id, payload);
    const second = await authorsApiSteps.update(author.id, payload);

    const fetched = await authorsApiSteps.getById(author.id);

    expect(first.id).toBe(second.id);
    expect(first.id).toBe(author.id);
    expect(fetched.firstName).toBe('Leo');
    expect(fetched.lastName).toBe('Tolstoy');
  });

  // TC-POS-007
  test('TC-POS-007: should overwrite author data with different values on second PUT', async ({ authorsApiSteps }) => {
    await authorsApiSteps.update(author.id, getRandomAuthorOverridePayload({ firstName: 'Anton', lastName: 'Chekhov' }));
    await authorsApiSteps.update(author.id, getRandomAuthorOverridePayload({ firstName: 'Fyodor', lastName: 'Dostoevsky' }));

    const fetched = await authorsApiSteps.getById(author.id);

    expect(fetched.firstName).toBe('Fyodor');
    expect(fetched.lastName).toBe('Dostoevsky');
  });
});
