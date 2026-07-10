# Locators in Playwright

Playwright has its built in locators. Those are ARIA based locators which mimic real user / assistive technology like behaviour. They interact with browser as how user interact with them.

## getBy locators

Below are playwright built in locators order by there preference provided by playwright org.

- getByRole
- getByLabel
- getByPlaceholder
- getByText
- getByAltText
- getByTitle
- getByTestId

## Ways to write locators

```js
// Approach 01- Playwright Built in method Locator.
await page.locator();

// Approach 02 - directly place locator inside actions
await page.click("locator");
await page.fill("locator", "fill_details");

// Approach 03 -  getBy most preffered
await page.getByRole("role", { name: "value" });
```

---

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
