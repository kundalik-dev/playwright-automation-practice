a# Locators in Playwright

## Ways to locate element

- Role Based
- XPath
- CSS
- Property

There are two types of locators

- Absolute
- Relative

### Absolute XPath:

- An absolute XPath is a way of locating an element using an XML expression `beginning` from root
  node i.e. html node in case of web pages.
- The main `disadvantage` of absolute XPath is that even with slightest change
  in the UI or any element the whole absolute XPath fails.
- Example - html/body/div/div[2]/div/div/div/div[1]/div/input

### Relative XPath:

- A relative XPath is a way of locating an element using an XML expression beginning from `anywhere` in
  the HTML document.
- There are different ways of creating relative XPaths which are used for creating robust XPaths.
- Example: //input[@id='username']

## Code to locate locators

```js
// Approach 01- Playwright Locators finding
await page.locator().click();

// Approach 02 - directly place locator inside click
await page.click("locator");
await page.fill("locator", "fill_details");

// Approach 03 -  getBy most preffered
await page.getByRole("role", { name: "value" });
```

## getBy locators

- getByRole
- getByLabel
- getByPlaceholder
- getByText
- getByAltText
- getByTitle
- getByTestId

### 1. getByRole

Ways to find roles

- aria-label
- aria-labelledby
- label & nested label text
- inner text / sub-elements (Buttons, links, headers)
- placeholder
- title attribute

```js
await page.getByRole("role", { name: "role-value" });
```

- role => can be button, textbox, link etc.
- name => name value findings methods mentioned above

### 2. getByLabel

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

### 3. getByPlaceholder

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

### 4. getByText

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

### 5. getByAltText

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

### 6. getByTitle

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

### 7. getByTestId

**What:** Locates elements by a dedicated test attribute (default `data-testid`), independent of DOM structure, text, or styling.

```javascript
page.getByTestId("submit-btn"); // exact match (default, no substring)
page.getByTestId(/submit-.*/); // regex
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

## Xpath Locators

```

//tagName[@attribute = 'value']

```

- XPath (XML Path) is a query language used to locate nodes in XML/HTML documents.
- In
  Selenium WebDriver, it’s one of the Most powerful locator that can locate almost any
  element.
- Relative (preferred): `//input[@id='txtUserID']`
- Absolute (avoid): `/html/body/form/input`

### Types of locators

All arrange in there order of preference

- id
- name
- css selectors
- xpath
- linktext
- partial-linktext
- tagname
- className

## CSS Selectors

- CSS Selector is one of the most powerful and preferred locators.
- It is processed natively by the browser engine, making it faster and more reliable than XPath in most cases.

| Pattern               | Example               | Meaning                                 |
| --------------------- | --------------------- | --------------------------------------- |
| Tag + ID              | `input#search`        | `<input>` with `id="search"`            |
| Tag + Class           | `button.login-btn`    | `<button>` with `class="login-btn"`     |
| Attribute             | `input[name='email']` | `<input>` with attribute `name="email"` |
| Starts with           | `input[name^='user']` | Attribute `name` starts with `"user"`   |
| Ends with             | `input[name$='id']`   | Attribute `name` ends with `"id"`       |
| Contains              | `input[name*='pass']` | Attribute `name` contains `"pass"`      |
| Parent + Direct Child | `div > input`         | Direct child `<input>` of `<div>`       |
| Ancestor Descendant   | `div input`           | Any `<input>` anywhere inside `<div>`   |
| Nth-child             | `ul li:nth-child(2)`  | Second `<li>` inside `<ul>`             |

## CSS Selector vs XPath

| Feature                 | CSS Selector                              | XPath                                            |
| ----------------------- | ----------------------------------------- | ------------------------------------------------ |
| Speed                   | Faster (native browser engine)            | Slower (parsed separately)                       |
| Syntax                  | Short, clean                              | Verbose, complex                                 |
| Text search             | Not supported                             | Supported via `text()`                           |
| DOM traversal direction | Only forward (down DOM)                   | Forward + backward (up DOM with ancestor/parent) |
| Best use                | Stable attributes (`id`, `class`, `name`) | When text or parent traversal is needed          |

## Axes locators

XPath Axes are used when traditional locators (id, name, class) are insufficient — typically for elements without
unique attributes or in complex table/grid structures.

| Axis                  | Description                                                         | Example                                            |
| --------------------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| **child**             | Selects immediate children of the current node.                     | `//div[@id='container']/child::input`              |
| **parent**            | Selects the immediate parent of the current node.                   | `//input[@id='login']/parent::div`                 |
| **ancestor**          | Selects all parent nodes up the hierarchy.                          | `//input[@id='login']/ancestor::form`              |
| **descendant**        | Selects all child nodes down the hierarchy within the current node. | `//form[@id='loginForm']/descendant::input`        |
| **following-sibling** | Nodes sharing the same parent, coming AFTER the current node.       | `//label[@id='username']/following-sibling::input` |
| **preceding-sibling** | Nodes sharing the same parent, coming BEFORE the current node.      | `//input[@id='password']/preceding-sibling::label` |
| **following**         | All nodes after the current node in document order.                 | `//div[@id='header']/following::button`            |
| **preceding**         | All nodes before the current node in document order.                | `//div[@id='footer']/preceding::input`             |
| **self**              | The current node itself.                                            | `self::*`                                          |

## Advance locators

- contains

### Advance

#### 1. child unique parent is not

Advance locators where child is unique parent is not. To find we first find child locator using id then we pass that inside parent tagname `//tagName [.// childLocator[@id='link']]`

```html
<a href="https://google.com>
  <span id='link'>google.com</span>
</a>

<!-- locators -->
//a [.// span[@id='link']]
```

#### 2. Index Based

To find label 1 we use () bracket based index as normal index are brittle. `(//label [name='lanel'])[1]`

- using normal way of indexing then all become [1] matched.

```html
<div>
  <label name="label">lable 1</label>
</div>
<div>
  <label name="label">lable 2</label>
</div>
<div>
  <label name="label">lable 3</label>
</div>
```

## XPath Functions & Operators

| Function / Operator  | Usage Example                                  | Use Case                          |
| -------------------- | ---------------------------------------------- | --------------------------------- |
| **contains()**       | `//input[contains(@name, 'txtUser')]`          | Partial attribute match           |
| **starts-with()**    | `//input[starts-with(@class, 'btn')]`          | Useful for dynamic IDs            |
| **text()**           | `//button[text()='Submit']`                    | Match by visible text             |
| **OR (or)**          | `//input[@type='submit' or @name='btnLogin']`  | Either condition                  |
| **AND (and)**        | `//input[@type='submit' and @name='btnLogin']` | Both conditions must be true      |
| **Dot (.)**          | `.//input[contains(@id, 'user')]`              | Search from current node downward |
| **Position / Index** | `//ul/li[3]/a`                                 | Select the 3rd list item's link   |
