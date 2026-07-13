# 🎭 Inputs & Labels in Playwright

Input box used to pass user inputs into forms.

```html
<!-- Approch 01 with for/id  -->
<label for="id1">Label Text</label>
<input type="text" id="id1" />

<!-- Approch 02 without for/id -->
<label>Label text here...<input type="text" /></label>
```

Inputs can be of different types

- text
- number
- checkbox
- radio

```js
// Playwright approach to fill data into inputs

//Approach 01 -
await page.locator("#loc1").fill("user_data");

// Approach 02 -
await page.fill("#loc1", "user_data");
```
