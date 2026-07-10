# getByLabel

Finds a form control (input/textarea/select) via its associated `<label>` text —
either through `for`/`id`, nesting the input inside the `<label>`, or `aria-labelledby`.

```js
await page.getByLabel("Username").fill("kunda");
```

### How `getByLabel` works

- `getByLabel` finds a form control (input, textarea, select) by the text of its associated <label> — not by the input's own attributes.
- Playwright resolves the label-to-control relationship the same way a browser/screen-reader does, via three possible HTML patterns:

#### 1. for/id association (most common)

Playwright reads the label's `for` attribute, matches it to an element with that `id`, and targets that element.

```html
<label for="username">Username</label> <input id="username" />
```

```js
await page.getByLabel("Username").fill("kunda");
```

#### 2. Wrapped/nested label

No `for/id` needed — the input is a descendant of the label, so Playwright infers the association from nesting.

```html
<label>
  Username
  <input />
</label>
```

#### 3. aria-labelledby

The input points to another element's text via aria-labelledby; Playwright follows that reference too.

```html
<span id="lbl">Username</span> <input aria-labelledby="lbl" />
```

- Matching is exact by default; pass `{ exact: false }` or a regex (`/user/i`) for partial/case-insensitive match.
- Preferred over id/class based locators because it mirrors how a real user identifies a field
  and is accessibility-aware.
