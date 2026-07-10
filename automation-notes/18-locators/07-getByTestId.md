# getByTestId

**What:** Locates elements by a dedicated test attribute (default `data-testid`), independent of DOM structure, text, or styling.

```javascript
page.getByTestId("submit-btn"); // exact match (default, no substring)
page.getByTestId(/submit-.*/); // regex
```

Also we can configure our `data-testid` attribute in `playwright.config.js` file under use

```js
//playwright.config.js
use: {
  testIdAttribute: "data-testMyId";
}
```

**Matching:**

- String → **exact match only** (no substring/case-insensitive behavior like other locators)
- Regex → pattern matching

**Use when:** no stable role/label/text/placeholder exists, or UI text/structure changes frequently — most resilient locator since it's purpose-built for testing.

**Key behaviors:**

- Lazy + auto-waits
- Strict mode applies
- Custom attribute name configurable via `testIdAttribute` in `playwright.config.ts` (default is `data-testid`)

**Watch out:** last resort in priority order — requires devs to add the attribute; doesn't reflect real user-facing behavior/accessibility.
