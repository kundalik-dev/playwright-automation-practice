# getByPlaceholder

**What:** Locates `<input>`/`<textarea>` by their `placeholder` attribute.

```javascript
<input placeholder="Enter your email" />;

page.getByPlaceholder("Enter your email");
```

**Matching:**

- String → substring, case-insensitive by default
- `{ exact: true }` → exact match
- Regex → `page.getByPlaceholder(/email/i)`

Ways to find or write

```js
page.getByPlaceholder("email"); // substring, case-insensitive
page.getByPlaceholder("Enter your email", { exact: true }); // must match exactly
page.getByPlaceholder(/email/i); // regex
```

**Use when:** no `<label>` exists, only a placeholder (e.g., search bars, minimal login forms).

**Avoid when:** a proper `<label>` exists — use `getByLabel` instead (more accessible, more stable).

**Key behaviors:**

- Lazy — resolves only on action (`.click()`, `.fill()`), not on locator creation
- Auto-waits for attached/visible/stable
- Strict mode — throws if multiple matches; scope with parent locator or use `.first()`

**Watch out:** brittle across i18n/localized placeholder text.
