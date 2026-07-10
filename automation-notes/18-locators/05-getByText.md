# getByText

`getByText` locates elements by their **rendered text content** — the visible text a user would actually read on the page. It searches the DOM for elements whose text node (including nested children's combined text) matches the given string or pattern.

**What:** Locates elements by their visible/rendered text content.

```javascript
page.getByText("welcome"); // substring, case-insensitive
page.getByText("Welcome back, User", { exact: true }); // must match exactly
page.getByText(/welcome/i); // regex
```

**Matching:**

- String → substring, case-insensitive by default
- `{ exact: true }` → exact match
- Regex → `page.getByText(/welcome/i)`

**Priority order:**
`getByRole` > `getByLabel` > `getByPlaceholder` > **`getByText`** > `getByTestId`

**Use when:** no role/label/placeholder available — e.g. buttons, links, headings, error/success messages, toasts.

**Avoid when:** text is likely to change (copy edits, i18n) or a semantic locator (`getByRole`) is available instead.

**Key behaviors:**

- Lazy + auto-waits (attached/visible/stable)
- Matches full text of an element **including nested children** — can over-match if not scoped
- Strict mode — throws on multiple matches; scope with parent locator or `.first()`

**Watch out:** fragile to copy/i18n changes; can match unintended parent/wrapper elements.
