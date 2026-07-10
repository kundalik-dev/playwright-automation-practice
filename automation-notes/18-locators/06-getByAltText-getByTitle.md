# getByAltText

**What:** Locates elements by their `alt` attribute (mainly `<img>`, also `<area>`, `<input type="image">`).

```javascript
// getByAltText
page.getByAltText("logo"); // substring, case-insensitive
page.getByAltText("Company logo", { exact: true }); // must match exactly
page.getByAltText(/logo/i); // regex
```

**Matching:**

- String → substring, case-insensitive by default
- `{ exact: true }` → exact match
- Regex → `page.getByAltText(/logo/i)`

**Use when:** testing images, icons, avatars, image buttons — no visible text/role/label available.

**Key behaviors:**

- Lazy + auto-waits
- Reliable/stable since `alt` is written for accessibility, not casual UI copy
- Strict mode applies — narrow if multiple matches

**Watch out:** only works on elements that actually have an `alt` attribute set.

# getByTitle

**What:** Locates elements by their `title` attribute (shows as a tooltip on hover).

```javascript
// getByTitle
page.getByTitle("close"); // substring, case-insensitive
page.getByTitle("Close dialog", { exact: true }); // must match exactly
page.getByTitle(/close/i); // regex
```

**Matching:**

- String → substring, case-insensitive by default
- `{ exact: true }` → exact match
- Regex → `page.getByTitle(/close/i)`

**Use when:** element has a `title` attribute but no accessible role/label/text (e.g. icon buttons with tooltips).

**Key behaviors:**

- Lazy + auto-waits
- Strict mode applies — narrow if multiple matches

**Watch out:** `title` is rarely used in modern apps; not reliably announced by all screen readers — lower priority than `getByRole`/`getByLabel`.
