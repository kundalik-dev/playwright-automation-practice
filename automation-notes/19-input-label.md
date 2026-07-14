# 🎭 Inputs & Labels in Playwright

Input and labels are html tag used to capture user inputs and label the input fields. Inputs can be of different types such as:- `text` `number` `checkbox` `radio` `email` `password` `textbox` etc.

## Ways to create input tags with label and without lable

```html
<!-- Approch 01 with for/id  -->
<label for="id1">Label Text</label>
<input type="text" id="id1" />

<!-- Approch 02 without for/id -->
<label>Label text here...<input type="text" /></label>

<!-- Approach 03 without lable -->
<input type="checkbox" />
```

## Playwright approach to fill data into inputs

```js
//Approach 01 - locator with fill
await page.locator("#loc1").fill("user_data");

// Approach 02 - fill method directly
await page.fill("#loc1", "user_data");
```

## Different input types need different actions

| Input type                              | Correct method                            |
| --------------------------------------- | ----------------------------------------- |
| text, number, email, password, textarea | `.fill(value)`                            |
| checkbox, radio                         | `.check()` / `.uncheck()` (not `.fill()`) |
| `<select>`                              | `.selectOption(value)`                    |
| file input                              | `.setInputFiles(path)`                    |
| contenteditable / rich text             | `.pressSequentially(text)`                |

## 👉 Locating inputs via label (recommended)

- `getByLabel()` finds an input by its associated label text, using the same accessible-name logic as a screen reader.
- Works for all three label patterns shown above (for/id, wrapping label, or no label at all won't match - use a different locator).

```js
await page.getByLabel("Label Text").fill("user_data");
```

Prefer this over `#id` locators - it breaks if the visible label text changes (which you want to know about), and doesn't break on internal ID refactors.

Other locator strategies when there's no label:

```js
await page.getByPlaceholder("Enter email").fill("test@test.com");
await page.getByRole("textbox", { name: "Email" }).fill("test@test.com");
await page.getByTestId("email-input").fill("test@test.com");
```

### fill()

- `.fill()` sets the value directly via DOM and dispatches `input`/`change` events - fast, but skips real keypress events.
- If the app listens to `keydown`/`keyup` (autocomplete, input masks), use `.pressSequentially()` to type character-by-character instead.
- `.fill()` already clears existing content before typing, so a separate `.clear()` call usually isn't needed.

## Checking input state before interacting

Playwright auto-waits for visible + enabled + stable before `.fill()`, but these are also available for explicit checks:

```js
await page.locator("#loc1").isDisabled();
await page.locator("#loc1").isEditable();
await page.locator("#loc1").isEnabled();
```

## Methods related to Inputs & Labels

- `fill()` => fill the inputs. can accept locators
- `pressSequentially()` => to press character by character or keyboard shortcut press
- `press("Control+A")` => to press keyboard shortcuts
- `toBeVisible()` => element is rendered and visible in the viewport
- `toBeEditable()` => element is enabled AND not readonly
- `toBeEnabled()` / `toBeDisabled()` => based on the `disabled` attribute
- `toBeChecked()` => checkbox/radio is checked
- `toBeEmpty()` => input/textarea has no value
- `toHaveValue(value)` => input value matches exactly, or against a regex
- `toHaveValues(values)` => for multi-select, matches array of selected values
- `toHaveAttribute(name, value)` => checks a specific attribute (e.g. `placeholder`, `type`)
- `isDisabled()` => to check element is disabled or not
- `isEditable()` => to check element is editable or not
- `isEnabled()` => to check element is enabled or not for future actions

```js
// Value assertions
await expect(page.locator("#loc1")).toHaveValue("user_data"); // exact
await expect(page.locator("#loc1")).toHaveValue(/user_.*/); // regex
await expect(page.locator("#loc1")).toBeEmpty(); // empty input/textarea

// Visibility
await expect(page.locator("#loc1")).toBeVisible();

// Checkbox / radio state
await expect(page.locator("#agree")).toBeChecked();
await expect(page.locator("#agree")).not.toBeChecked();

// Enabled/disabled/editable
await expect(page.locator("#loc1")).toBeEnabled();
await expect(page.locator("#loc1")).toBeDisabled();
await expect(page.locator("#loc1")).toBeEditable(); // enabled AND not readonly

// Attribute-level checks
await expect(page.locator("#loc1")).toHaveAttribute(
  "placeholder",
  "Enter name",
);
await expect(page.locator("#loc1")).toHaveAttribute("type", "email");

// Multi-select
await expect(page.locator("select#multi")).toHaveValues(["a", "b"]);

// Manual assertion (when you need to compute/compare something first)
const val = await page.locator("#loc1").inputValue();
expect(val).toBe("user_data");
```

**Rule of thumb:**

- prefer `expect(locator).toHaveValue(...)` over `inputValue()` + manual `expect()`
- the `toHaveValue` in form auto-retries/auto-waits until the assertion passes or times out
- manual `inputValue()` does not.
