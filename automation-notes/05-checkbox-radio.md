# 🎭 Checkbox and Radio

## Radio Button

- Allows single selection.
- You can select only one option within a group.
- Clicking another option automatically deselects the previous one.
- Clicking an active radio button does nothing.
- ⛔ Radio button cannot be manually unchecked once checked. Playwright throws an error.

```html
<input type="radio" />
```

## Checkbox Button

- Allows multi-selection.
- You can select none, one, or multiple options within a group.
- Clicking an active checkbox unchecks it.

```html
<input type="checkbox" />
```

## Methods

- `check()` => `to check` any radio or checkbox
- `uncheck()` => `to uncheck` any radio or checkbox
- `setChecked(checked)` => to check or uncheck based on a boolean value
- `isChecked()` used to know whether it is `checked or not`
- `toBeChecked()` => to check whether it is checked or not
- `toBeEnabled()` => To ensure an element is interactive (not disabled)
- `toBeVisible()` => To verify an element is rendered on the page before trying to click it
- `toBeTruthy()` => check expected condition is true
- `toBeFalsy()` => check expected condition is false

```js
// radio and checkbox check, uncheck, isChecked method
await page.locator("#loc").check();
await page.locator("#loc").uncheck();
await page.locator("#loc").isChecked();

// assertions on checkbox & radios
await expect(await page.locator("#loc").isChecked()).toBeTruthy();
await expect(await page.locator("#loc").isChecked()).toBeFalsy();

// preferred web-first assertion (auto-retries, no manual await needed)
await expect(page.locator("#loc")).toBeChecked();
await expect(page.locator("#loc")).not.toBeChecked();
```

### setChecked()

`setChecked(checked)` is used when the desired state (checked/unchecked) is decided at runtime, e.g. coming from test data, a config flag, or a condition — instead of hard-coding a `check()` or `uncheck()` call. It sets the checkbox/radio to match the boolean passed in, and does nothing if it's already in that state.

```js
// set state dynamically based on a boolean
const shouldBeChecked = true;
await page.locator("#loc").setChecked(shouldBeChecked);

// useful when driving state from test data
for (const item of [
  { loc: "#loc1", checked: true },
  { loc: "#loc2", checked: false },
]) {
  await page.locator(item.loc).setChecked(item.checked);
}
```

## Multi checkBox

To check multiple records we first store them in an array and then perform check operation using a for...of loop.

```js
// Check ops on multiple elements
const allCheckLoc = ["loc1"];

for (const checkLoc of allCheckLoc) {
  await page.locator(checkLoc).check();
}

// Uncheck on checked locators only
for (const checkLoc of allCheckLoc) {
  if (await page.locator(checkLoc).isChecked()) {
    await page.locator(checkLoc).uncheck();
  }
}
```

# 🤖 CheckBox & Radio in Selenium

In Selenium `click()` method is used to `check` and `uncheck` any radio or checkbox.

## Checkbox and Radio Button Method Comparison

| Action / Goal                    | Playwright (JS/TS)                        | Selenium (Java)                                  |
| -------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| Check a Checkbox                 | `locator.check()`                         | `if(!el.isSelected()) el.click();`               |
| Uncheck a Checkbox               | `locator.uncheck()`                       | `if(el.isSelected()) el.click();`                |
| Select a Radio Button            | `locator.check()`                         | `if(!el.isSelected()) el.click();`               |
| Get Selection State              | `await locator.isChecked()`               | `element.isSelected()`                           |
| Assert State is Checked          | `await expect(locator).toBeChecked()`     | `assertTrue(element.isSelected());`              |
| Assert State is Unchecked        | `await expect(locator).not.toBeChecked()` | `assertFalse(element.isSelected());`             |
| Verify if Clickable / Enabled    | `await locator.isEnabled()`               | `element.isEnabled()`                            |
| Force Check (Bypass UI overlays) | `locator.check({ force: true })`          | `js.executeScript("arguments[0].click();", el);` |

## Key Behavioral Differences

| Behaviour           | Playwright                                                                | Selenium                                                             |
| ------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `Check / Uncheck`   | Idempotent — won't click if already in the target state.                  | `click()` always toggles state; needs a manual `isSelected()` guard. |
| `Radio vs Checkbox` | Same `.check()` API works for both radios and checkboxes.                 | `.click()` used for everything, no distinction.                      |
| `Selection State`   | `isChecked()` returns a `Promise<boolean>` (must `await`).                | `isSelected()` returns a plain `boolean` synchronously.              |
| `Assertions`        | `toBeChecked()` is web-first and auto-retries until true or timeout.      | `assertTrue`/`assertFalse` check the state once, immediately.        |
| `Enabled Check`     | Auto-checks actionability (enabled, visible, stable) before every action. | Requires an explicit `isEnabled()` call; no auto-waiting.            |
| `Force Actions`     | `{ force: true }` option bypasses actionability checks.                   | No equivalent option; falls back to `JavascriptExecutor`.            |
