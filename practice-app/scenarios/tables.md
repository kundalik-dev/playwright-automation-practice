# Tables — Practice Scenarios

**App URL:** `http://localhost:3000/tables/index.html`
**Run app:** `npm run serve` (live-server on port 3000)

This file covers six table patterns from real apps and interviews:
static table locators, column sorting, search+filter, pagination, inline edit/delete, and a full combined data grid.

Data used: **15 employees** (Engineering / Marketing / HR / Sales departments).
Product table (Section 1) has 6 rows of product inventory.

Locator legend: `id` · `role` · `data-testid` · `nth()` · `filter()` · `scope by row` · `aria-sort` · `aria-current`

---

## Scenario 1 — Static table: four locator strategies for the same cell
**Level:** Beginner
**Concept:** `getByRole` table hierarchy, `nth()`, `filter()`, scoping within a row
**Section:** 1. Basic static table

### Steps
1. Navigate to the app URL.
2. Assert the table has **6 data rows** using `getByRole('row')` (exclude header row with `nth`).
3. Locate the **"MacBook Pro"** cell using `getByTestId('cell-1-product')`.
4. Locate the same cell using `getByRole('cell', { name: 'MacBook Pro' })`.
5. Locate the same cell using `getByRole('row').filter({ hasText: 'MacBook Pro' }).getByRole('cell').first()`.
6. Assert the **"iPad Air"** row has a stock badge containing `"Out of stock"`.
7. Assert the static table has exactly **5 column headers** matching `['Product','Category','Price','Stock','Rating']`.

### Expected Result
- All four locator strategies resolve the same cell.
- The "iPad Air" row's stock cell contains `"Out of stock"`.
- Header count and labels match exactly.

### Playwright Code Hint
```js
const table = page.getByTestId('static-table');

// 6 data rows (header row is not a tbody row)
await expect(page.getByTestId('static-tbody').getByRole('row')).toHaveCount(6);

// Three ways to the same cell
await expect(page.getByTestId('cell-1-product')).toHaveText('MacBook Pro');
await expect(page.getByRole('cell', { name: 'MacBook Pro' })).toBeVisible();
await expect(
  table.getByRole('row').filter({ hasText: 'MacBook Pro' }).getByRole('cell').first()
).toHaveText('MacBook Pro');

// Out of stock assertion scoped to the iPad row
const ipadRow = table.getByRole('row').filter({ hasText: 'iPad Air' });
await expect(ipadRow.getByTestId('cell-4-stock')).toContainText('Out of stock');

// Header labels
const headers = table.getByRole('columnheader');
await expect(headers).toHaveText(['Product', 'Category', 'Price', 'Stock', 'Rating']);
```

---

## Scenario 2 — Sort by Name: ascending then descending
**Level:** Intermediate
**Concept:** `aria-sort` attribute assertions, first-row text after sort
**Section:** 2. Sortable table

### Steps
1. Assert `sort-th-name` has `aria-sort="none"` on load.
2. Click `sort-th-name` (first click → ascending).
3. Assert `aria-sort` on `sort-th-name` is `"ascending"`.
4. Assert the first data row name cell is `"Aarav Sharma"` (alphabetically first).
5. Click `sort-th-name` again (second click → descending).
6. Assert `aria-sort` is `"descending"`.
7. Assert the first data row is now `"Vikram Singh"` (alphabetically last in first 10).
8. Click `sort-th-name` a third time (clears sort → back to `"none"`).

### Expected Result
- `aria-sort` cycles: `none` → `ascending` → `descending` → `none`.
- First row changes accordingly after each click.

### Playwright Code Hint
```js
const nameHeader = page.getByTestId('sort-th-name');
const tbody      = page.getByTestId('sort-tbody');

await expect(nameHeader).toHaveAttribute('aria-sort', 'none');

await nameHeader.click();
await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
await expect(tbody.getByRole('row').first().getByRole('cell').first()).toHaveText('Aarav Sharma');

await nameHeader.click();
await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
await expect(tbody.getByRole('row').first().getByRole('cell').first()).toHaveText('Vikram Singh');

await nameHeader.click();
await expect(nameHeader).toHaveAttribute('aria-sort', 'none');
```

---

## Scenario 3 — Sort by Salary: only one header is active at a time
**Level:** Intermediate
**Concept:** Sort exclusivity — clicking a new column resets the previous one
**Section:** 2. Sortable table

### Steps
1. Click `sort-th-salary` → ascending (lowest salary first).
2. Assert `sort-th-salary` has `aria-sort="ascending"`.
3. Assert `sort-th-name` still has `aria-sort="none"`.
4. Assert first row's salary cell is `$48,000` (Meera Nair, lowest).
5. Now click `sort-th-name`.
6. Assert `sort-th-name` gets `aria-sort="ascending"`.
7. Assert `sort-th-salary` reverts to `aria-sort="none"`.

### Expected Result
- Only one column has an active `aria-sort` at any time.
- Switching columns resets the previous column's sort indicator.

### Playwright Code Hint
```js
await page.getByTestId('sort-th-salary').click();
await expect(page.getByTestId('sort-th-salary')).toHaveAttribute('aria-sort', 'ascending');
await expect(page.getByTestId('sort-th-name')).toHaveAttribute('aria-sort', 'none');

// lowest salary first: Meera Nair at $48,000
await expect(
  page.getByTestId('sort-tbody').getByRole('row').first()
    .locator('[data-testid^="sort-salary-"]')
).toHaveText('$48,000');

await page.getByTestId('sort-th-name').click();
await expect(page.getByTestId('sort-th-name')).toHaveAttribute('aria-sort', 'ascending');
await expect(page.getByTestId('sort-th-salary')).toHaveAttribute('aria-sort', 'none');
```

---

## Scenario 4 — Search table by name and filter by department
**Level:** Intermediate
**Concept:** Text filtering, dropdown filter, combined filter, empty state
**Section:** 3. Search & filter table

### Steps
1. Assert result count on load is `"Showing 10 of 10 employees"`.
2. Type `"priya"` in `search-input`.
3. Assert result count is `"Showing 1 of 10 employees"`.
4. Assert only `"Priya Patel"` row is visible.
5. Clear the search, select `"Engineering"` in `dept-filter`.
6. Assert result count is `"Showing 4 of 10 employees"` (4 engineers in first 10).
7. Additionally type `"rohan"` in search → assert count drops to `1`.
8. Click **Clear** button → assert all 10 rows shown again.

### Expected Result
- Search and department filter work independently and together.
- Clear resets both filters.

### Playwright Code Hint
```js
await expect(page.getByTestId('search-result-count')).toHaveText('Showing 10 of 10 employees');

await page.getByTestId('search-input').fill('priya');
await expect(page.getByTestId('search-result-count')).toHaveText('Showing 1 of 10 employees');
await expect(page.getByTestId('search-tbody').getByRole('row')).toHaveCount(1);
await expect(page.getByTestId('search-name-2')).toBeVisible();

// Dept filter alone
await page.getByTestId('search-input').fill('');
await page.getByTestId('dept-filter').selectOption('Engineering');
await expect(page.getByTestId('search-result-count')).toHaveText('Showing 4 of 10 employees');

// Combined: dept + name
await page.getByTestId('search-input').fill('rohan');
await expect(page.getByTestId('search-result-count')).toHaveText('Showing 1 of 10 employees');

// Clear
await page.getByTestId('search-clear-btn').click();
await expect(page.getByTestId('search-result-count')).toHaveText('Showing 10 of 10 employees');
```

---

## Scenario 5 — Search: no-match empty state
**Level:** Intermediate
**Concept:** Empty-state message assertion
**Section:** 3. Search & filter table

### Steps
1. Type `"zzznomatch"` in `search-input`.
2. Assert result count shows `"Showing 0 of 10 employees"`.
3. Assert the empty-state message `"No employees match your filters."` is visible in the table body.
4. Assert the table body has exactly **1 row** (the empty-state row).

### Expected Result
- No data rows are rendered when the filter produces zero results.
- An empty-state row is shown inside `<tbody>`.

### Playwright Code Hint
```js
await page.getByTestId('search-input').fill('zzznomatch');
await expect(page.getByTestId('search-result-count')).toHaveText('Showing 0 of 10 employees');
await expect(page.getByTestId('search-tbody')).toContainText('No employees match your filters.');
await expect(page.getByTestId('search-tbody').getByRole('row')).toHaveCount(1);
```

---

## Scenario 6 — Pagination: navigate pages and assert row counts
**Level:** Intermediate → Advanced
**Concept:** Page navigation, `aria-current`, Prev/Next disabled state, "Showing X–Y" text
**Section:** 4. Paginated table

### Steps
1. Assert table has **5 rows** on page 1.
2. Assert `pag-btn-1` has `aria-current="page"`.
3. Assert **Prev** button is **disabled** on page 1.
4. Assert `pag-info` shows `"Showing 1–5 of 15"`.
5. Click **Next** → assert 5 rows, `pag-btn-2` has `aria-current="page"`, info shows `"Showing 6–10 of 15"`.
6. Click page button **3** directly (`pag-btn-3`).
7. Assert `pag-btn-3` has `aria-current="page"`.
8. Assert **Next** is **disabled** (last page).
9. Assert `pag-info` shows `"Showing 11–15 of 15"`.

### Expected Result
- 5 rows per page on pages 1 and 2; 5 rows on page 3.
- Active page button carries `aria-current="page"`.
- Prev disabled on page 1, Next disabled on page 3.

### Playwright Code Hint
```js
const tbody = page.getByTestId('pag-tbody');

// Page 1
await expect(tbody.getByRole('row')).toHaveCount(5);
await expect(page.getByTestId('pag-btn-1')).toHaveAttribute('aria-current', 'page');
await expect(page.getByTestId('pag-prev')).toBeDisabled();
await expect(page.getByTestId('pag-info')).toHaveText('Showing 1–5 of 15');

// Page 2
await page.getByTestId('pag-next').click();
await expect(page.getByTestId('pag-btn-2')).toHaveAttribute('aria-current', 'page');
await expect(page.getByTestId('pag-info')).toHaveText('Showing 6–10 of 15');

// Page 3 via page button
await page.getByTestId('pag-btn-3').click();
await expect(page.getByTestId('pag-btn-3')).toHaveAttribute('aria-current', 'page');
await expect(page.getByTestId('pag-next')).toBeDisabled();
await expect(page.getByTestId('pag-info')).toHaveText('Showing 11–15 of 15');
```

> Interview note: `aria-current="page"` is the correct accessibility attribute for the active page button.
> Assert it rather than a CSS class — it's what screen readers and specs rely on.

---

## Scenario 7 — Pagination: assert specific employee appears on the correct page
**Level:** Intermediate → Advanced
**Concept:** Cross-page row existence, `toBeVisible` vs `toHaveCount(0)`
**Section:** 4. Paginated table

### Steps
1. Assert `pag-name-7` (Karan Joshi, id=7) is **visible** on page 1.
2. Assert `pag-name-11` (Rahul Desai, id=11) is **not present** on page 1 (row not in DOM yet).
3. Navigate to page 2 (`pag-btn-2`).
4. Assert `pag-name-11` is now **visible** on page 2.
5. Assert `pag-name-7` is no longer in the DOM on page 2.

### Expected Result
- Pagination renders only the current page's slice of data.
- Rows from other pages are not present in the DOM (not just hidden).

### Playwright Code Hint
```js
// Page 1
await expect(page.getByTestId('pag-name-7')).toBeVisible();
await expect(page.getByTestId('pag-name-11')).toHaveCount(0); // not in DOM

// Page 2
await page.getByTestId('pag-btn-2').click();
await expect(page.getByTestId('pag-name-11')).toBeVisible();
await expect(page.getByTestId('pag-name-7')).toHaveCount(0);
```

> Key distinction: `toBeHidden()` fails if the element isn't in DOM at all — use `toHaveCount(0)` when
> the element may be completely absent (not rendered), and `toBeHidden()` only when it exists but is hidden.

---

## Scenario 8 — Row actions: Edit, update, and Save
**Level:** Intermediate → Advanced
**Concept:** Inline edit, scoping buttons by row context, input within a table cell
**Section:** 5. Table with row actions (Edit / Delete)

### Steps
1. Assert `actions-name-3` shows `"Rohan Mehta"`.
2. Locate the Edit button **scoped to row 3** (not just by test-id).
3. Click `edit-btn-3`.
4. Assert `edit-name-3` (inline input) is visible with value `"Rohan Mehta"`.
5. Assert Save and Cancel buttons appear; Edit and Delete buttons are gone for that row.
6. Clear `edit-name-3` and type `"Rohan M. Updated"`.
7. Click `save-btn-3`.
8. Assert `actions-name-3` now shows `"Rohan M. Updated"`.
9. Assert the inline input is gone (Save/Cancel replaced by Edit/Delete again).

### Expected Result
- Clicking Edit replaces cell text with inputs.
- Saving persists the new name and restores the view mode.

### Playwright Code Hint
```js
await expect(page.getByTestId('actions-name-3')).toHaveText('Rohan Mehta');

// Scope the Edit button to row 3 (not just by testid)
const row3 = page.getByTestId('actions-row-3');
await row3.getByRole('button', { name: 'Edit' }).click();
// or: await page.getByTestId('edit-btn-3').click();

await expect(page.getByTestId('edit-name-3')).toBeVisible();
await expect(page.getByTestId('edit-name-3')).toHaveValue('Rohan Mehta');

// Edit and Delete are gone during inline edit
await expect(page.getByTestId('edit-btn-3')).toHaveCount(0);

await page.getByTestId('edit-name-3').clear();
await page.getByTestId('edit-name-3').fill('Rohan M. Updated');
await page.getByTestId('save-btn-3').click();

await expect(page.getByTestId('actions-name-3')).toHaveText('Rohan M. Updated');
await expect(page.getByTestId('edit-name-3')).toHaveCount(0);
```

---

## Scenario 9 — Row actions: Delete a row and assert DOM removal
**Level:** Intermediate → Advanced
**Concept:** DOM removal assertion, row count decrement, `toHaveCount(0)`
**Section:** 5. Table with row actions (Edit / Delete)

### Steps
1. Assert row count info shows `"8 employees in table"`.
2. Assert `actions-row-4` (Sneha Rao) exists in DOM.
3. Click `delete-btn-4`.
4. Assert `actions-row-4` is **no longer in the DOM** (`toHaveCount(0)`).
5. Assert row count info now shows `"7 employees in table"`.
6. Delete all remaining rows one by one (or in sequence).
7. Assert the empty-state message `"All employees deleted."` appears.

### Expected Result
- Deleted row is removed from the DOM immediately.
- Row count decrements after each delete.
- Empty state appears when all rows are deleted.

### Playwright Code Hint
```js
await expect(page.getByTestId('actions-row-count')).toHaveText('8 employees in table');
await expect(page.getByTestId('actions-row-4')).toBeVisible();

await page.getByTestId('delete-btn-4').click();
await expect(page.getByTestId('actions-row-4')).toHaveCount(0);
await expect(page.getByTestId('actions-row-count')).toHaveText('7 employees in table');
```

---

## Scenario 10 — Combined grid: search + sort + paginate together
**Level:** Advanced
**Concept:** State interaction — filter resets page, sort works on filtered subset
**Section:** 6. Combined data grid

### Steps
1. Assert `grid-pag-info` shows `"Showing 1–5 of 15"` (all 15, page 1).
2. Filter by department `"Engineering"` — assert result count `"5 of 15 employees"`.
3. Assert page resets to 1 and pagination info shows `"Showing 1–5 of 5"`.
4. Assert only 1 page button exists (5 Engineering rows ≤ 5 per page).
5. Click `grid-th-salary` to sort Engineering employees by salary ascending.
6. Assert `grid-th-salary` has `aria-sort="ascending"`.
7. Assert the first row is the lowest-paid engineer (Nisha Bose, $72,000).
8. Now search for `"karan"` additionally — result count drops to `"1 of 15"`.
9. Clear all filters — assert 15 rows, 3 pages, page 1 active.

### Expected Result
- Filtering resets pagination to page 1.
- Sorting applies to the filtered subset.
- Clearing resets all state to initial.

### Playwright Code Hint
```js
await expect(page.getByTestId('grid-pag-info')).toContainText('Showing 1–5 of 15');

// Filter by Engineering
await page.getByTestId('grid-dept').selectOption('Engineering');
await expect(page.getByTestId('grid-result-count')).toContainText('5 of 15');
await expect(page.getByTestId('grid-pag-info')).toContainText('Showing 1–5 of 5');
await expect(page.getByTestId('grid-pages').getByRole('button')).toHaveCount(1);

// Sort salary ascending within Engineering
await page.getByTestId('grid-th-salary').click();
await expect(page.getByTestId('grid-th-salary')).toHaveAttribute('aria-sort', 'ascending');
// Lowest engineering salary: Nisha Bose at $72,000
await expect(page.getByTestId('grid-tbody').getByRole('row').first())
  .toContainText('Nisha Bose');

// Add name search on top of dept filter
await page.getByTestId('grid-search').fill('karan');
await expect(page.getByTestId('grid-result-count')).toContainText('1 of 15');

// Clear all
await page.getByTestId('grid-clear-btn').click();
await expect(page.getByTestId('grid-result-count')).toContainText('15 of 15');
await expect(page.getByTestId('grid-pages').getByRole('button')).toHaveCount(3);
await expect(page.getByTestId('grid-pag-btn-1')).toHaveAttribute('aria-current', 'page');
```

---

## Scenario 11 — Combined grid: sort descending then navigate to page 2
**Level:** Advanced
**Concept:** Sorting + pagination interaction; page 2 data reflects sort order
**Section:** 6. Combined data grid

### Steps
1. Click `grid-th-salary` twice (descending — highest salary first).
2. Assert first row is `"Karan Joshi"` ($105,000).
3. Navigate to page 2 (`grid-pag-btn-2`).
4. Assert the first row on page 2 continues the descending salary order.
5. Assert the salary on page 2 row 1 is lower than page 1 row 1.

### Expected Result
- Sort order persists across page navigation.
- Page 2 shows the next 5 rows in the same sorted order.

### Playwright Code Hint
```js
await page.getByTestId('grid-th-salary').click(); // ascending
await page.getByTestId('grid-th-salary').click(); // descending
await expect(page.getByTestId('grid-th-salary')).toHaveAttribute('aria-sort', 'descending');

// Karan Joshi is the highest-paid ($105,000)
await expect(page.getByTestId('grid-tbody').getByRole('row').first()).toContainText('Karan Joshi');

// Page 2 — still in salary-desc order
await page.getByTestId('grid-pag-btn-2').click();
const firstRowPage2 = page.getByTestId('grid-tbody').getByRole('row').first();
// $98,000 (Divya Verma) should be the 6th highest
await expect(firstRowPage2).toContainText('Divya Verma');
```

---

## Locator practice checklist

| Element | Strategies to try |
|---|---|
| Table itself | `getByRole('table')` · `getByTestId('static-table')` · `[aria-label="..."]` |
| Header cells | `getByRole('columnheader')` · `getByTestId('th-product')` · `locator('thead th')` |
| All data rows | `getByTestId('static-tbody').getByRole('row')` · `locator('tbody tr')` |
| Specific row | `getByTestId('static-row-3')` · `getByRole('row').filter({ hasText: 'AirPods' })` |
| Cell in a row | `row.getByRole('cell').nth(2)` · `getByTestId('cell-3-price')` |
| Sort header | `getByTestId('sort-th-salary')` · `getByRole('columnheader', { name: /Salary/ })` |
| Active page btn | `getByTestId('pag-btn-2')` · `.pag-btn.active` · `[aria-current="page"]` |
| Edit btn in row | `getByTestId('edit-btn-3')` · `getByTestId('actions-row-3').getByRole('button',{name:'Edit'})` |
| Inline input | `getByTestId('edit-name-3')` · `getByTestId('actions-row-3').locator('input').first()` |
| Status badge | `getByTestId('status-active')` · `.status-active` · `getByText('Active').first()` |

---

## Common pitfalls / interview talking points

- **`toBeHidden()` vs `toHaveCount(0)`** — paginated rows that aren't rendered are absent from DOM entirely; use `toHaveCount(0)`. Hidden rows still in DOM → use `toBeHidden()`.
- **`aria-sort` is the correct way** to assert sort direction — not a CSS class or icon text, which can change with redesigns.
- **`aria-current="page"`** is the semantic attribute for the active pagination button — assert it, not class names.
- **Filter resets page** — in real grids (and this one), changing a filter resets pagination to page 1. Test this interaction explicitly.
- **Sort on filtered subset** — when sorting a filtered grid, only the filtered rows are sorted. Test after filtering, not on the full dataset.
- **Scope buttons by row** — always prefer `row.getByRole('button', { name: 'Edit' })` over a global `getByRole('button', { name: 'Edit' })` to avoid ambiguity when multiple rows are visible.
- **DOM removal vs hide** — `delete` removes the DOM node; `fill('')` + `save` just updates the text. Use `toHaveCount(0)` for deleted rows.
