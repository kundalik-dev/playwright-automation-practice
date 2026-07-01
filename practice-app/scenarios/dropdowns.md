# Dropdowns — Practice Scenarios

**App URL:** `http://localhost:3000/dropdowns/index.html`
**Run app:** `npm run serve` (live-server on port 3000)

This file covers every dropdown flavour you meet in real apps and interviews:
native single, native multi, grouped (optgroup), custom/non-native (hidden),
autocomplete/auto-suggest, and dependent/cascading dropdowns.

Locator-strategy legend used below:
`id` · `label` · `role` (combobox/listbox/option) · `data-testid` · `filter()` · `nth/xpath axes` · `no-static-locator` (dynamic text).

---

## Scenario 1 — Native single-select by value, label & index
**Level:** Beginner
**Concept:** `selectOption()` three ways
**Section:** 1. Native single-select

### Steps
1. Navigate to the app URL.
2. Select **India** in `#country` **by value** (`in`).
3. Assert output box contains `Country: in`.
4. Re-select the country **by label** (`{ label: 'United States' }`).
5. Re-select the country **by index** (`{ index: 3 }` → United Kingdom).
6. Read the currency `<select>` and assert its **preselected** value is `inr`.

### Expected Result
- Each `selectOption` call updates the output box.
- `#currency` starts with INR already selected without any interaction.

### Playwright Code Hint
```js
const country = page.getByTestId('country-select');
await country.selectOption('in');
await expect(page.getByTestId('native-single-output')).toContainText('Country: in');
await country.selectOption({ label: 'United States' });
await country.selectOption({ index: 3 });
await expect(page.getByTestId('currency-select')).toHaveValue('inr');
```

---

## Scenario 2 — Assert all options & handle a disabled option
**Level:** Beginner → Intermediate
**Concept:** Reading option lists, disabled options
**Section:** 1. Native single-select

### Steps
1. Grab all `#country` option labels and assert the exact list.
2. Assert the placeholder first option text is `-- Select country --`.
3. In `#currency`, confirm the `btc` option is **disabled**.
4. Try to `selectOption('btc')` inside a `try/catch` / `expect(...).rejects` — it should fail.

### Expected Result
- Option label list matches exactly.
- Selecting a disabled option throws (Playwright rejects the action).

### Playwright Code Hint
```js
const labels = await page.getByTestId('country-select').locator('option').allTextContents();
expect(labels).toEqual([
  '-- Select country --', 'India', 'United States', 'United Kingdom', 'Germany', 'Japan',
]);
await expect(page.locator('#currency option[value="btc"]')).toBeDisabled();
await expect(page.getByTestId('currency-select').selectOption('btc')).rejects.toThrow();
```

---

## Scenario 3 — Native multi-select: select many, read, clear
**Level:** Intermediate
**Concept:** Array `selectOption`, `selectedOptions`
**Section:** 2. Native multi-select

### Steps
1. Select **JavaScript**, **TypeScript**, **Go** in one `selectOption([...])` call.
2. Click **Show selected skills** and assert output shows `Selected (3)` with the three labels.
3. Re-select only `python` (single value) and confirm the previous selection is **replaced**, not added.
4. Clear the selection with `selectOption([])` and assert `Nothing selected` after clicking the button.

### Expected Result
- Passing an array selects exactly those options.
- Passing a single value collapses the selection to one.
- `selectOption([])` deselects everything.

### Playwright Code Hint
```js
const skills = page.getByTestId('skills-select');
await skills.selectOption(['js', 'ts', 'go']);
await page.getByTestId('read-skills-btn').click();
await expect(page.getByTestId('native-multi-output')).toContainText('Selected (3)');

await skills.selectOption('py');            // replaces
await skills.selectOption([]);              // clears
await page.getByTestId('read-skills-btn').click();
await expect(page.getByTestId('native-multi-output')).toHaveText('Nothing selected');
```

---

## Scenario 4 — Grouped select (optgroup) scoping
**Level:** Intermediate
**Concept:** Locating an option inside a specific group; disabled group
**Section:** 3. Grouped select

### Steps
1. Select **Model 3** but scope the option strictly under the **Tesla** optgroup.
2. Assert output shows `Group: Tesla`.
3. Assert the **BMW** optgroup is disabled and its `X5` option is not selectable.

### Expected Result
- Option resolves only within the intended group.
- Disabled optgroup options can't be selected.

### Playwright Code Hint
```js
const car = page.getByTestId('car-select');
await car.selectOption('model3');
await expect(page.getByTestId('optgroup-output')).toContainText('Group: Tesla');

// scoped locator practice
await expect(page.locator('optgroup[label="Tesla"] > option')).toHaveCount(2);
await expect(page.locator('optgroup[label="BMW"]')).toBeDisabled();
```

---

## Scenario 5 — Custom (non-native) dropdown: open, then click option
**Level:** Advanced
**Concept:** No `selectOption`; click-to-open, hidden options, auto-wait
**Section:** 4. Custom dropdown

### Steps
1. Assert the options panel `#status-panel` is **hidden** initially (`toBeHidden`).
2. Click the trigger (`status-trigger`) and wait for the panel to become visible.
3. Assert `aria-expanded` on the trigger flips to `true`.
4. Click the **On Leave** option (locate by role `option` + name, or by text — no static id).
5. Assert the trigger label now reads `On Leave` and output shows `Status: onleave`.
6. Confirm the disabled option **Probation** does not change the selection when clicked.

### Expected Result
- Panel is only in an interactable state after clicking the trigger.
- Selecting updates the visible label; disabled option is inert.

### Playwright Code Hint
```js
const panel = page.getByTestId('status-panel');
await expect(panel).toBeHidden();

await page.getByTestId('status-trigger').click();
await expect(panel).toBeVisible();
await expect(page.getByTestId('status-trigger')).toHaveAttribute('aria-expanded', 'true');

await page.getByRole('option', { name: 'On Leave' }).click();
await expect(page.getByTestId('status-trigger')).toContainText('On Leave');
await expect(page.getByTestId('custom-output')).toContainText('Status: onleave');
```

> Interview note: this mirrors OrangeHRM / React-Select / Material UI dropdowns.
> `selectOption()` only works on real `<select>` elements — here you must click.

---

## Scenario 6 — Autocomplete / auto-suggest
**Level:** Advanced
**Concept:** Type → wait for async list → pick; no-result handling
**Section:** 5. Autocomplete

### Steps
1. Type `pu` into `city-input`.
2. Wait for the suggestion list to render (there is a ~250ms delay — rely on auto-waiting, not a hard sleep).
3. Assert **Pune** appears in the suggestions.
4. Click **Pune** and assert the input value is `Pune` and output shows `City: Pune`.
5. Type `xyz` and assert the **No cities found** message appears.
6. (Stretch) Type `de`, then use `ArrowDown` + `Enter` keyboard selection if you extend the widget.

### Expected Result
- Suggestions appear only after typing and after the async delay.
- Clicking a suggestion fills the input and clears the list.
- Non-matching text shows the empty-state message.

### Playwright Code Hint
```js
await page.getByTestId('city-input').fill('pu');
const options = page.getByTestId('city-suggestions').getByRole('option');
await expect(options.filter({ hasText: 'Pune' })).toBeVisible();
await options.filter({ hasText: 'Pune' }).click();
await expect(page.getByTestId('city-input')).toHaveValue('Pune');
await expect(page.getByTestId('autocomplete-output')).toHaveText('City: Pune');

await page.getByTestId('city-input').fill('xyz');
await expect(page.getByTestId('city-suggestions')).toContainText('No cities found');
```

---

## Scenario 7 — Dependent / cascading dropdowns
**Level:** Advanced
**Concept:** Options generated from a prior selection; disabled-until-ready
**Section:** 6. Dependent dropdowns

### Steps
1. Assert `#dep-state` is **disabled** on load.
2. Select **India** in `#dep-country`.
3. Assert `#dep-state` becomes enabled and its options are the Indian states (assert count/list).
4. Select **Karnataka** and assert output `Country: india | State: karnataka`.
5. Change country to **USA** and assert the state options fully change (e.g. `California` present, `Maharashtra` gone).

### Expected Result
- State dropdown stays disabled until a country is chosen.
- State options are rebuilt to match the selected country.

### Playwright Code Hint
```js
const state = page.getByTestId('dep-state');
await expect(state).toBeDisabled();

await page.getByTestId('dep-country').selectOption('india');
await expect(state).toBeEnabled();
await expect(state.locator('option')).toContainText(['Maharashtra', 'Karnataka']);

await state.selectOption('karnataka');
await expect(page.getByTestId('dependent-output')).toHaveText('Country: india | State: karnataka');

await page.getByTestId('dep-country').selectOption('usa');
await expect(state.locator('option', { hasText: 'California' })).toBeVisible();
await expect(state.locator('option', { hasText: 'Maharashtra' })).toHaveCount(0);
```

---

## Locator practice checklist
Try to solve each scenario using **more than one** strategy:

| Element | Strategies to practice |
|---|---|
| `#country` | `getByLabel('Country')` · `#country` · `getByRole('combobox')` · `getByTestId` |
| `#skills` options | `locator('#skills option')` · `getByRole('option')` · `filter({ hasText })` |
| optgroup option | `locator('optgroup[label="Tesla"] > option')` · xpath axes |
| custom option | `getByRole('option', { name })` · text locator · `nth()` — **no id** |
| autocomplete item | dynamic — `getByTestId('city-suggestions').getByRole('option')` + `filter` |
| dep-state | assert `toBeDisabled` / `toBeEnabled`, re-query options after change |

## Common pitfalls / interview talking points
- `selectOption()` works **only** on native `<select>`. Custom widgets need click flows.
- Custom-dropdown options may be **absent/hidden in the DOM** until opened — assert `toBeHidden` first.
- Autocomplete needs **auto-waiting** for async-rendered items; avoid `waitForTimeout`.
- Multi-select: a single-value `selectOption` **replaces** the whole selection.
- Cascading dropdowns: always **re-locate** the second dropdown's options after the first changes (stale option references).
