import { expect } from '@playwright/test';
import { test } from '@fixtures/pages.fixture';

test('should update author selection through the author row', async ({ page, addNewBookForm }) => {
  await page.setContent(`
    <div>
      <h3>➕ Add New Book</h3>
      <div class="author-checkbox" onclick="
        this.querySelector('input').checked = true;
        document.getElementById('selection').textContent = 'Test Author selected';
      ">
        <input type="checkbox" onclick="event.stopPropagation()">
        <span>Test Author</span>
      </div>
      <output id="selection" role="status">No author selected</output>
    </div>
  `);

  await addNewBookForm.selectAuthor('Test Author');

  await expect(addNewBookForm.getAuthorCheckboxLocator('Test Author')).toBeChecked();
  await expect(page.getByRole('status')).toHaveText('Test Author selected');
});
