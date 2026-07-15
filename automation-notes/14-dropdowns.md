# 🎭 Dropdown in playwright

## IMP Methods

- selectOption({label:"txt"})
- selectOption({value:"txt"})
- selectOption({index:1})
- selectOption("visible_txt")
- toHaveCount(3) => to count the options
- page.$$("#country option) => to get all options in array

## Different types of dropdowns

- Select tag
- without select tag
- multi select
- boostrap dropdowns
- auto suggestions
- dynamic

## select tag dropdown

- to handle select tag dropdown we have `selectOption({key:value})` method
- which selects using
  - `{label:visible_txt}` => select using visible text with label
  - `{value:""}` => use value tags txt here
  - `visibleText`
  - `{index:1}` => indexing starts from 0

```html
<select id="country">
  <option value="usa">USA</option>
  <option value="ind">IND</option>
  <option value="uk">UK</option>
</select>
```

```js
// Approach 01 -
await page.locator("#country").selectOption({ label: "IND" });
await page.locator("#country").selectOption({ value: "ind" });
await page.locator("#country").selectOption({ index: 1 });
await page.locator("#country").selectOption("IND");

// Approach 02 -
await page.selectOption("#country", { value: "us" });

// To get all options
const allOptions = await page.locator("#country option");
await expect(allOptions).toHaveCount(3);
```

## Multi Select

- to select multiple option

```js
await page.selectOption("#country", ["blue", "red"]);

await page
  .locator("#country")
  .selectOption([{ label: "IND" }, { label: "usa" }]);

await page
  .locator("#country")
  .selectOption([{ value: "ind" }, { value: "usa" }]);

await page.locator("#country").selectOption([{ index: 1 }, { index: 3 }]);
```

## Boostrap dropdowns

- These are dropdowns dont have any select tags.
- they use `ul li` or `input`, `button`, `div` tags

```js
const allOptions = await page.locator("ul>li");
const allOptions = await page.$$("ul>li");

// Use loop to match and click on li tag
for (let i; i < allOptions.lenght; i++) {
  const option = await allOptions.nth(i);
  const optValue = await option.textContent();
  if (optValue.includes("ind") || optValue.includes("usa")) {
    await option.click();
  }
}
```

## Auto suggestion dropdown

## Handling hidden dropdown

## toHaveValue

- Use `toHaveValue()` for test assertions because it automatically waits for the element to be ready. Use inputValue() when you need to extract the value as a variable for conditional logic, logging, or math. [1]

## Quick Comparison

| Feature [2, 3, 4, 5, 6] | expect(locator).toHaveValue()                      | locator.inputValue()                                       |
| ----------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| Primary Use             | Making an assertion (pass/fail check).             | Fetching data to store in a variable.                      |
| Auto-Waiting            | Yes. Retries until the value matches or times out. | No. Grabs whatever value exists at that exact millisecond. |
| Return Value            | Returns a Promise (void).                          | Returns a Promise (string).                                |
| Best For                | Standard test validations.                         | if/else conditions, loops, or console logs.                |

---

## When to use toHaveValue() (Assertions)

Use this method when you want your test to verify a state and throw an error immediately if it fails. Because it features built-in auto-waiting, it prevents flaky tests caused by slow network requests or delayed UI rendering. [7, 8, 9]

// BEST: Test waits up to 5 seconds for the dropdown to equal 'jp'await expect(page.getByTestId('country-select')).toHaveValue('jp');
// BEST: Verifying a text input filled out by a user or an APIawait expect(page.locator('#username')).toHaveValue('JohnDoe');

---

## When to use inputValue() (Data Extraction)

Use this method when you need to read the current state of a form field and use that data later in your test script.

## 1. Conditional Logic (if/else)

```js
const currentCountry = await page.getByTestId('country-select').inputValue();
// Use inputValue when you need to branch your test code executionif (currentCountry === 'us') {
await page.fill('#zipcode', '90210'); // US specific field
} else if (currentCountry === 'uk') {
await page.fill('#postcode', 'SW1A 1AA'); // UK specific field
}
```

## 2. Debugging and Logging

const debugValue = await page.locator('#coupon-code').inputValue();
console.log(`The applied coupon is: ${debugValue}`);

## 3. Data Transformations or Calculations

const priceString = await page.locator('#item-price').inputValue(); // e.g., "150"const priceAsNumber = parseFloat(priceString);
// Perform math with the extracted value
expect(priceAsNumber).toBeGreaterThan(100);
