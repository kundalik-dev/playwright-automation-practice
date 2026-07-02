# Date Pickers — Practice Scenarios

**App URL:** `http://localhost:3000/datepickers/index.html`
**Run app:** `npm run serve` (live-server on port 3000)

This file covers all date-picker flavours you encounter in real apps and interviews:
native date input, date constraints (min/max), date & time variants (datetime-local / month / week / time),
native date range pair, custom calendar widget, and date-based table filtering.

Locator-strategy legend: `id` · `label` · `name` · `aria-label` · `data-testid` · `role` · `getByText` · no-id (dynamic)

---

## Scenario 1 — Fill a native date input using multiple locator strategies
**Level:** Beginner
**Concept:** `fill('YYYY-MM-DD')`, four locator strategies for the same element
**Section:** 1. Native date input

### Steps
1. Navigate to the app URL.
2. Fill `#dob` with `1995-08-15` using `locator('#dob')`.
3. Fill the same input using `getByLabel('Date of Birth')`.
4. Fill using `getByTestId('dob-input')`.
5. Fill using `page.locator('[aria-label="Date of Birth"]')`.
6. Fill the **Appointment Date** input (no `id`) using `getByTestId('appointment-input')`.
7. Click **Read Dates** and assert output contains `DOB: 1995-08-15` and `Appointment: 2026-09-10`.

### Expected Result
- All four locator strategies reach the same `#dob` field.
- Output box updates with both dates after clicking the button.

### Playwright Code Hint
```js
// Four locator strategies for the same element
await page.locator('#dob').fill('1995-08-15');
await page.getByLabel('Date of Birth').fill('1995-08-15');
await page.getByTestId('dob-input').fill('1995-08-15');
await page.locator('[aria-label="Date of Birth"]').fill('1995-08-15');

// No-id strategy for appointment
await page.getByTestId('appointment-input').fill('2026-09-10');

await page.getByTestId('read-dates-btn').click();
await expect(page.getByTestId('native-date-output')).toContainText('DOB: 1995-08-15');
await expect(page.getByTestId('native-date-output')).toContainText('Appointment: 2026-09-10');
```

---

## Scenario 2 — Assert min/max constraints and detect invalid input
**Level:** Beginner → Intermediate
**Concept:** Reading `min`/`max` attributes, `validity` API, out-of-range detection
**Section:** 2. Date with constraints

### Steps
1. Assert `future-date-input` has a `min` attribute equal to today's date string.
2. Assert `past-date-input` has a `max` attribute equal to today's date string.
3. Fill `future-date-input` with **yesterday's date** (invalid — before min).
4. Use `evaluate()` to read `input.validity.rangeUnderflow` — assert it is `true`.
5. Fill `future-date-input` with **tomorrow's date** (valid).
6. Assert `validity.rangeUnderflow` is now `false`.
7. Assert the constraint output box contains the filled date.

### Expected Result
- `min`/`max` attributes are set dynamically on page load.
- Browser flags an out-of-range fill via the Constraint Validation API.
- Valid date clears the violation.

### Playwright Code Hint
```js
const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrow  = new Date(Date.now() + 86400000).toISOString().split('T')[0];

// Assert min attribute
await expect(page.getByTestId('future-date-input')).toHaveAttribute('min', today);
await expect(page.getByTestId('past-date-input')).toHaveAttribute('max', today);

// Fill invalid (past) date into future-only input
const futureInput = page.getByTestId('future-date-input');
await futureInput.fill(yesterday);
const underflow = await futureInput.evaluate(el => el.validity.rangeUnderflow);
expect(underflow).toBe(true);

// Fill valid date
await futureInput.fill(tomorrow);
const underflowAfter = await futureInput.evaluate(el => el.validity.rangeUnderflow);
expect(underflowAfter).toBe(false);
```

> Interview note: `fill()` sets the raw value bypassing the calendar UI. Always verify
> browser validity separately — the element won't throw; it just marks itself invalid.

---

## Scenario 3 — Date & time variants: correct format for each input type
**Level:** Intermediate
**Concept:** `fill()` format differs per input type; `toHaveValue()` assertions
**Section:** 3. Date & time variants

### Steps
1. Fill `meeting-datetime` with `2026-08-20T14:30` (datetime-local format).
2. Assert the input has value `2026-08-20T14:30`.
3. Fill `billing-month` with `2026-09` (month format).
4. Fill `sprint-week` with `2026-W35` (week format).
5. Fill `alarm-time` with `07:45` (time format).
6. Assert the variants output box updates after each change (it shows the last changed field).

### Expected Result
- Each `fill()` succeeds with its correct format string.
- `toHaveValue()` returns the filled string as-is.

### Playwright Code Hint
```js
await page.getByTestId('meeting-datetime').fill('2026-08-20T14:30');
await expect(page.getByTestId('meeting-datetime')).toHaveValue('2026-08-20T14:30');

await page.getByTestId('billing-month').fill('2026-09');
await expect(page.getByTestId('billing-month')).toHaveValue('2026-09');

await page.getByTestId('sprint-week').fill('2026-W35');
await expect(page.getByTestId('sprint-week')).toHaveValue('2026-W35');

await page.getByTestId('alarm-time').fill('07:45');
await expect(page.getByTestId('alarm-time')).toHaveValue('07:45');

await expect(page.getByTestId('variants-output')).toContainText('07:45');
```

> Common mistake: using `2026-08-20 14:30` (space) instead of `2026-08-20T14:30` (T) for datetime-local.

---

## Scenario 4 — Native date range: booking flow with dynamic min update
**Level:** Intermediate
**Concept:** Chained date inputs, `toBeDisabled`/`toBeEnabled`, `min` updates dynamically
**Section:** 4. Date range picker (native pair)

### Steps
1. Assert `range-end` is **disabled** on load.
2. Fill `range-start` with `2026-08-01`.
3. Assert `range-end` becomes **enabled**.
4. Assert `range-end` now has `min` attribute set to `2026-08-01`.
5. Fill `range-end` with `2026-08-05`.
6. Assert output shows `Nights: 4`.
7. Click **Book Stay** and assert output shows `Booked: 2026-08-01 → 2026-08-05 (4 nights)`.
8. (Edge case) Clear `range-start`, attempt Book, assert error message appears.

### Expected Result
- Check-out remains disabled until check-in is filled.
- Check-out's `min` dynamically mirrors check-in date.
- Booking with incomplete dates shows the error message.

### Playwright Code Hint
```js
await expect(page.getByTestId('range-end')).toBeDisabled();

await page.getByTestId('range-start').fill('2026-08-01');
await expect(page.getByTestId('range-end')).toBeEnabled();
await expect(page.getByTestId('range-end')).toHaveAttribute('min', '2026-08-01');

await page.getByTestId('range-end').fill('2026-08-05');
await expect(page.getByTestId('range-output')).toContainText('Nights: 4');

await page.getByTestId('book-btn').click();
await expect(page.getByTestId('range-output')).toHaveText('Booked: 2026-08-01 → 2026-08-05 (4 nights)');

// Edge case — book without filling
await page.getByTestId('range-start').fill('');
await page.getByTestId('book-btn').click();
await expect(page.getByTestId('range-error')).toContainText('Please select both');
```

---

## Scenario 5 — Custom calendar: open, navigate, and select a date
**Level:** Advanced
**Concept:** Click-to-open, month navigation, day cell clicks — no `fill()`, no `selectOption()`
**Section:** 5. Custom calendar picker

### Steps
1. Assert the calendar popup (`cal-popup`) is **hidden** on load.
2. Click `cal-display` (the text input) to open the calendar.
3. Assert `cal-popup` becomes **visible**.
4. Assert `aria-expanded` on `cal-display` is `"true"`.
5. Read `cal-month-label` text — note the current month/year.
6. Click **Next month** (`cal-next`) and assert the month label changes.
7. Click **Previous month** (`cal-prev`) to go back.
8. Click the day cell with `data-testid="cal-day-15"`.
9. Assert the popup closes (`toBeHidden`).
10. Assert `cal-display` input shows the selected ISO date.
11. Assert output box contains `Selected:` with the date.

### Expected Result
- Popup is only visible after clicking the input trigger.
- Month navigation changes the label and re-renders day cells.
- Clicking a valid day closes the popup and updates the display input.

### Playwright Code Hint
```js
const popup = page.getByTestId('cal-popup');
await expect(popup).toBeHidden();

await page.getByTestId('cal-display').click();
await expect(popup).toBeVisible();
await expect(page.getByTestId('cal-display')).toHaveAttribute('aria-expanded', 'true');

// Read current month
const monthText = await page.getByTestId('cal-month-label').textContent();
console.log('Current month:', monthText);

// Navigate forward
await page.getByTestId('cal-next').click();
await expect(page.getByTestId('cal-month-label')).not.toHaveText(monthText);

// Go back
await page.getByTestId('cal-prev').click();

// Select day 15
await page.getByTestId('cal-day-15').click();
await expect(popup).toBeHidden();
await expect(page.getByTestId('cal-display')).not.toHaveValue('');
await expect(page.getByTestId('custom-cal-output')).toContainText('Selected:');
```

> Interview note: this mirrors Flatpickr, React Datepicker, MUI DatePicker.
> `fill()` only works on native `<input>` — custom pickers need full click flows.

---

## Scenario 6 — Custom calendar: assert disabled and booked dates
**Level:** Advanced
**Concept:** `toBeDisabled` on non-input elements, `aria-disabled`, blocked-date assertions
**Section:** 5. Custom calendar picker

### Steps
1. Open the calendar by clicking `cal-display`.
2. Assert that day cell `cal-day-booked-5` (booked) has class `booked` and `aria-disabled="true"`.
3. Click on a booked day — assert the output box does **not** update (selection unchanged).
4. Assert past-day cells have class `disabled` and `aria-disabled="true"`.
5. (Stretch) Try clicking a disabled past day; assert `cal-display` value remains empty.

### Expected Result
- Booked cells and past cells are visually marked and carry `aria-disabled`.
- Clicking them does not change the selection.

### Playwright Code Hint
```js
await page.getByTestId('cal-display').click();
await expect(page.getByTestId('cal-popup')).toBeVisible();

const bookedCell = page.getByTestId('cal-day-booked-5');
await expect(bookedCell).toHaveAttribute('aria-disabled', 'true');
await expect(bookedCell).toHaveClass(/booked/);

// Click booked — output should not change
await bookedCell.click({ force: true });
await expect(page.getByTestId('custom-cal-output')).toHaveText('No date selected');

// Past days carry aria-disabled too
await expect(page.getByTestId('cal-popup').locator('[aria-disabled="true"]')).not.toHaveCount(0);
```

---

## Scenario 7 — Date filter: apply a range and assert visible table rows
**Level:** Advanced
**Concept:** Date-driven table filtering, visible row count assertions, `toBeVisible`/`toBeHidden` on rows
**Section:** 6. Date filter (table scenario)

### Steps
1. Assert the table initially shows **5 rows**.
2. Fill `filter-from` with `2026-06-10` and `filter-to` with `2026-06-30`.
3. Click **Apply Filter**.
4. Assert the output box says `Showing 2 of 5 records`.
5. Assert rows for order `#1002` and `#1003` are visible.
6. Assert rows `#1001`, `#1004`, `#1005` are hidden (not in DOM / display:none).
7. Click **Clear** and assert all 5 rows are visible again.

### Expected Result
- Only rows whose `data-date` falls within the from/to range are shown.
- Clear resets the filter and shows all rows.

### Playwright Code Hint
```js
// Initial state
await expect(page.locator('#orders-body tr')).toHaveCount(5);

// Apply filter
await page.getByTestId('filter-from').fill('2026-06-10');
await page.getByTestId('filter-to').fill('2026-06-30');
await page.getByTestId('apply-filter-btn').click();

await expect(page.getByTestId('filter-output')).toContainText('Showing 2 of 5');

// Visible rows
await expect(page.getByTestId('order-row-1002')).toBeVisible();
await expect(page.getByTestId('order-row-1003')).toBeVisible();

// Hidden rows
await expect(page.getByTestId('order-row-1001')).toBeHidden();
await expect(page.getByTestId('order-row-1004')).toBeHidden();
await expect(page.getByTestId('order-row-1005')).toBeHidden();

// Clear
await page.getByTestId('clear-filter-btn').click();
await expect(page.getByTestId('filter-output')).toContainText('All 5 records shown');
await expect(page.locator('#orders-body tr:not(.hidden-row)')).toHaveCount(5);
```

---

## Scenario 8 — Date filter edge cases: open-ended and no-match ranges
**Level:** Advanced
**Concept:** Open-ended ranges (single bound), empty result state
**Section:** 6. Date filter (table scenario)

### Steps
1. Fill only `filter-from` with `2026-07-01` (leave `filter-to` blank) → Apply.
2. Assert `Showing 2 of 5` (orders from July onwards: #1004, #1005).
3. Clear, then fill only `filter-to` with `2026-06-10` → Apply.
4. Assert `Showing 2 of 5` (orders up to June 10: #1001, #1002).
5. Clear, apply a range with no matching orders (e.g. `2025-01-01` to `2025-12-31`).
6. Assert `Showing 0 of 5`.

### Expected Result
- A single bound correctly filters one side of the range.
- A range that matches nothing results in 0 visible rows.

### Playwright Code Hint
```js
// Open-ended from
await page.getByTestId('filter-from').fill('2026-07-01');
await page.getByTestId('apply-filter-btn').click();
await expect(page.getByTestId('filter-output')).toContainText('Showing 2 of 5');
await page.getByTestId('clear-filter-btn').click();

// Open-ended to
await page.getByTestId('filter-to').fill('2026-06-10');
await page.getByTestId('apply-filter-btn').click();
await expect(page.getByTestId('filter-output')).toContainText('Showing 2 of 5');
await page.getByTestId('clear-filter-btn').click();

// No-match range
await page.getByTestId('filter-from').fill('2025-01-01');
await page.getByTestId('filter-to').fill('2025-12-31');
await page.getByTestId('apply-filter-btn').click();
await expect(page.getByTestId('filter-output')).toContainText('Showing 0 of 5');
await expect(page.locator('#orders-body tr:not(.hidden-row)')).toHaveCount(0);
```

---

## Locator practice checklist

Try each scenario using **more than one** locator strategy:

| Element | Strategies to try |
|---|---|
| `#dob` | `#dob` · `getByLabel('Date of Birth')` · `getByTestId('dob-input')` · `[aria-label="Date of Birth"]` |
| Appointment (no id) | `getByTestId('appointment-input')` · `[name="appointment"]` · `getByLabel(...)` |
| Constraint inputs | `getByTestId(...)` · `[name="futureDate"]` · `getByLabel(...)` |
| `cal-display` | `getByTestId('cal-display')` · `[aria-label="Select a date"]` · `getByRole('textbox', { name: ... })` |
| Month nav buttons | `getByTestId('cal-prev')` · `getByLabel('Previous month')` · `getByRole('button', { name: 'Previous month' })` |
| Day cells | `getByTestId('cal-day-15')` · `[data-date="2026-07-15"]` · `getByRole('gridcell', { name: '15 ...' })` |
| Order rows | `getByTestId('order-row-1002')` · `locator('#orders-body tr').nth(1)` |
| Filter buttons | `getByTestId('apply-filter-btn')` · `getByRole('button', { name: 'Apply Filter' })` |

---

## Common pitfalls / interview talking points

- **`fill()` format is strict.** `datetime-local` needs `'YYYY-MM-DDTHH:MM'`; a space instead of `T` silently fails.
- **`fill()` bypasses the calendar UI** — browser validity still runs. Always check `validity.*` when constraints matter.
- **Custom pickers don't respond to `fill()`** — you must click the trigger, wait for the popup, then click the cell.
- **Auto-waiting on popup open** — prefer `await expect(popup).toBeVisible()` over `waitForTimeout` before clicking a day.
- **`toBeHidden()` vs. `toHaveCount(0)`** — hidden rows still exist in DOM (`display:none`); use `toBeHidden()` not `toHaveCount(0)` for filtered rows.
- **Dynamic `min` on range pickers** — re-assert attributes after the first input changes, not just on load.
- **Booked/disabled days** — clicking them force (`{force:true}`) does NOT select them; the event listener is absent, making `{force:true}` a useful negative test tool.
