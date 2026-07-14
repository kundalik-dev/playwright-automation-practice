# 🎭 Playwright Notes

---

# 🎭 iFrame

Iframe is two seperate html code file integrated into one using `iframe` element.

## Handling iFrame

There are two ways to handle iframe.

1. frameLocator
2. frame object
3. contentFrame

```html
<html>
  <iframe class="outerFrame" name="outerFrameName">
    <iframe class="innnerFrame" name="innerFrameName">
      <button id="btn">Click me</button>
    </iframe>
  </iframe>
</html>
```

## frameLocator

- auto waits for elements
- reducess flakiness
- works well with nested frames
- meta data is not present using frameLocator

```js
const frame = await page.frameLocator(".innerFrame");
frame.locator("#btn").click();
```

## frame Object

Using frame object we get extra methods to operate on frames such as

- frame name
- Url
- childFrame
- parentFrame
- isDetached
- page

Any frame can be selected using two methods in frame object

- by url
- by name

### By URL

```js
const frame = page.frame({ url: "https://frame-url.com" });
frame.locator("#btn").click();
```

### By Name

```js
const frame = page.frame("innerFrameName");
frame.locator("#btn").click();
```

## Different Methods Present In Frame

```js
const frame = page.frame("frameName");
frame.url();
frame.name();
frame.childFrame();
frame.parentFrame();
frame.isDetached();
```

## All Frames

To get all frames we have method `page.frames()`. This will get all the frames inside main frame or we can also provide `name` or `url` inside `frames()` method.

```js
const frames = page.frames();
```

## Frame traversing

frame traversing doen by

- frame.paretnFrame()
- frame.page()

where `frame.pratentFrame()` it traverse immediate frame one level up and `frame.page()` it switch all context to main page instead of one step at a time.

> frameLocator is most preffered way to interact with iframe in playwright. But they dont provide meta inforamtion like name, url, isDetached for that we use frame object.

# 🤖 iFrame in selenium

```java
// 1. By index (order in the DOM, 0-based)
driver.switchTo().frame(0);

// 2. By name or id attribute
driver.switchTo().frame("frameNameOrId");

// 3. By WebElement (most robust — locate the iframe like any element)
WebElement frame = driver.findElement(By.cssSelector("iframe#myFrame"));
driver.switchTo().frame(frame);

```

The WebElement approach is preferred because index is fragile (breaks if frame order changes) and not every frame has a name/id.

- `defaultContent()` — jumps all the way back to the top-level page.
- `parentFrame()` — moves up just one level (useful for nested frames).

### Waiting for a frame (recommended)

Frames may load asynchronously, so combine with `WebDriverWait`:

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(By.id("myFrame")));
```

## Common gotchas

- `NoSuchElementException` when an element "should" be there → you're usually in the wrong frame context. Check whether you forgot to switchTo().frame(...) or forgot to switchTo().defaultContent().
- After switching into a frame, all subsequent findElement calls are scoped to that frame until you switch out.

## Comparison Tables

### Playwright: frameLocator vs frame Object

| Aspect                                                    | frameLocator               | frame Object                 |
| --------------------------------------------------------- | -------------------------- | ---------------------------- |
| Auto-waits for elements                                   | Yes                        | No                           |
| Flakiness                                                 | Low (reduces flakiness)    | Higher                       |
| Nested frames                                             | Works well                 | Supported but manual         |
| Frame metadata (name, url, etc.)                          | Not available              | Available                    |
| Selecting a frame                                         | By selector                | By name or url               |
| Extra methods (childFrame, parentFrame, isDetached, page) | No                         | Yes                          |
| Best for                                                  | Simple element interaction | Inspecting/traversing frames |

### Selenium vs Playwright iFrame Handling

| Aspect                | Selenium (Java)                                 | Playwright                                   |
| --------------------- | ----------------------------------------------- | -------------------------------------------- |
| Model                 | Stateful — switch context in/out                | Stateless — chain straight in                |
| Switch into frame     | `driver.switchTo().frame(...)`                  | `page.frameLocator(...)` / `page.frame(...)` |
| Switch back out       | Required (`defaultContent()` / `parentFrame()`) | Not needed                                   |
| Auto-wait             | No (need `WebDriverWait`)                       | Yes (built-in)                               |
| Select frame by       | Index, name/id, WebElement                      | Selector, name, url                          |
| Scope after switching | All lookups scoped to frame until switch out    | Only chained locator is scoped               |
| Common pitfall        | Wrong frame context / forgot to switch out      | Few — no context to manage                   |

## Playwright Methods — Quick Revision

| Method                        | What it does                                                             |
| ----------------------------- | ------------------------------------------------------------------------ |
| `page.frameLocator(selector)` | Returns a frame locator (auto-waits) to act on elements inside the frame |
| `page.frame(name)`            | Get a frame object by its name                                           |
| `page.frame({ url })`         | Get a frame object by its url                                            |
| `page.frames()`               | Returns array of all frames on the page                                  |
| `frame.locator(selector)`     | Locate an element inside the frame                                       |
| `frame.url()`                 | Get the frame's url                                                      |
| `frame.name()`                | Get the frame's name                                                     |
| `frame.childFrame()`          | Get the child (nested) frame                                             |
| `frame.parentFrame()`         | Move one level up to the parent frame                                    |
| `frame.isDetached()`          | Check if the frame is detached from DOM                                  |
| `frame.page()`                | Jump straight back to the main page context                              |

## Playwright → Selenium (Java) Method Mapping

Selenium has no first-class frame object, so metadata is read via `getAttribute(...)` or the JavaScript executor.

| Playwright                            | Selenium (Java) equivalent                                                        |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| `frame.url()`                         | `frameElement.getAttribute("src")` or JS `document.URL`                           |
| `frame.name()`                        | `frameElement.getAttribute("name")` or JS `window.name`                           |
| `frame.parentFrame()`                 | `driver.switchTo().parentFrame()`                                                 |
| `frame.page()`                        | `driver.switchTo().defaultContent()`                                              |
| `frame.childFrame()`                  | switch into the nested frame (`switchTo().frame(...)`)                            |
| `frame.isDetached()`                  | no direct equivalent (catch `StaleElementReferenceException`)                     |
| `page.frames()`                       | `driver.findElements(By.tagName("iframe"))` (returns elements, not frame objects) |
| `page.frameLocator(sel).locator(...)` | `switchTo().frame(...)` then `findElement(...)`                                   |

---

# 🎭 Dialog

There are three types of dialog in playwright,

- alert
- confirm
- prompt

By default playwright **auto dismisses** every dialog. To actually handle them we need to listen for the `dialog` event using an `diloag handler`.

```js
page.on("dialog", async (d) => {
  await d.accept();
  await d.dismiss();
  d.type();
  d.message();
  d.defaultValue();
  d.page();
});
```

> Important: the `dialog handler` is always written **before** the action that triggers the alert, so it does not miss the dialog.

> Important: inside the handler you **must** call `d.accept()` or `d.dismiss()`. If you add a handler but never accept/dismiss, the dialog stays open and the test hangs.

## Events used to listen dialog

- `page.on()` => listens for the event continuously once activated
- `page.once()` => listens only once for the defined event
- `page.waitForEvent("dialog")` => waits for and returns the dialog (used when you want to listen inline)

## Different methods in dialog

- `d.type()` => gives type of dialog (`alert` / `confirm` / `prompt`)
- `d.message()` => gives text present on the dialog
- `d.defaultValue()` => gives the default value of a `prompt` dialog
- `d.page()` => gives 🚫
- `d.accept()` => clicks OK on the dialog
- `d.dismiss()` => dismisses (clicks Cancel) on the dialog
- `d.accept("john")` => sends text into a `prompt` input then accepts

## simple alert

Simple alert with only an `OK` button. Used to show a warning message.

```js
// starts listening for 'dialog' event
page.on("dialog", async (d) => {
  expect(d.type()).toContain("alert");
  expect(d.message()).toContain("alert message text");

  await d.accept();
  //   await d.dismiss();
});

// click on alert button
await page.locator("#alert-btn").click();
```

## confirm alert

Accept or reject type alert with `OK` and `Cancel` buttons.

```js
// starts listening for 'dialog' event
page.on("dialog", async (d) => {
  expect(d.type()).toContain("confirm");
  expect(d.message()).toContain("alert message text");

  await d.accept();
  //   await d.dismiss();
});

// click on alert button
await page.locator("#alert-btn").click();
```

## prompt alert

Accept or reject type alert where the user can also send a `custom message` into an input.

```js
// starts listening for 'dialog' event
page.on("dialog", async (d) => {
  expect(d.type()).toContain("prompt");
  expect(d.message()).toContain("alert message text");

  await d.accept("Kundalik"); // text passed into the prompt input
});

// click on alert button
await page.locator("#alert-btn").click();
```

## Dialog Handler

Using the dialog handler we can interact with alerts. We can inspect the dialog `type` and `message`, then either `accept` or `dismiss` them, and for a `prompt` alert we can provide an input value.

# page in dialog handler

```js
// Listen globally across all tabs in this context
context.on("dialog", async (dialog) => {
  const sourcePage = dialog.page(); // Get the page that triggered it
  const currentUrl = sourcePage.url();

  if (currentUrl.includes("/checkout")) {
    console.log(`Critical alert on checkout page: ${dialog.message()}`);
    await dialog.accept();
  } else {
    await dialog.dismiss();
  }
});
```

## Interview Questions

## Q - How handle alert in playwright?

### Q - Why do we add the dialog handler before clicking the alert button?

Ans:-

- The alert appears immediately when we click the alert button.
- JS is async in nature, so the alert can fire before a handler placed after the click is ready.
- To handle the alert we must already be listening on the `dialog` event; if the handler is placed after the click, we may lose the dialog.
- So the dialog handler is always placed before clicking the alert.

### Q - What is the difference between page.on() and page.once()?

Ans:-

- `page.on()` => once activated, listens for **every** dialog
- `page.once()` => listens **only once** after it is activated

### Q - What happens if we don't handle a dialog?

Ans:-

- Playwright auto dismisses it by default.
- But if a handler is registered and we never call `accept()`/`dismiss()`, the test will hang/timeout.

# 🤖 Alerts in Selenium

In Selenium Java an alert is handled using the `Alert` interface. We first switch to the alert, then act on it.

```java
// switch to the alert
Alert alert = driver.switchTo().alert();

alert.accept();              // click OK
alert.dismiss();             // click Cancel
alert.getText();             // read the alert message
alert.sendKeys("kundalik");  // type into a prompt alert
```

## Playwright vs Selenium — Alert Handling

| Aspect            | Playwright                           | Selenium (Java)                          |
| ----------------- | ------------------------------------ | ---------------------------------------- |
| Model             | Event driven (listen for `dialog`)   | Switch to alert (`switchTo().alert()`)   |
| When to set up    | Handler **before** the trigger click | Switch **after** the alert appears       |
| Default behaviour | Auto dismisses unless handled        | Stays open until handled (else error)    |
| Get type          | `d.type()`                           | No direct method                         |
| Read message      | `d.message()`                        | `alert.getText()`                        |
| Accept / OK       | `d.accept()`                         | `alert.accept()`                         |
| Dismiss / Cancel  | `d.dismiss()`                        | `alert.dismiss()`                        |
| Prompt input      | `d.accept("text")`                   | `alert.sendKeys("text")` then `accept()` |
| Not handled       | Auto dismissed                       | `UnhandledAlertException`                |

## Playwright → Selenium (Java) Method Mapping

| Playwright                   | Selenium (Java) equivalent                     |
| ---------------------------- | ---------------------------------------------- |
| `page.on("dialog", handler)` | `driver.switchTo().alert()`                    |
| `d.message()`                | `alert.getText()`                              |
| `d.accept()`                 | `alert.accept()`                               |
| `d.dismiss()`                | `alert.dismiss()`                              |
| `d.accept("text")`           | `alert.sendKeys("text")` then `alert.accept()` |
| `d.type()`                   | no direct equivalent                           |
| `d.defaultValue()`           | no direct equivalent use javaScript executor   |

---

# 🎭 Reporting in Playwright

Playwright has different built in reports

- List => simple list in command line
- Dot => ..F
- html => html report is created
- line => 4 passed
- json
- junit
- github actions
- custome reports
  - allure
  - monocart
  - tesults
  - current JS
  - serenity JS

## Report configuration

For config any report we need to add `report type` inside `playwrigh.config.js` file as shown below. Or we can run any report by passing argument in `CLI` as `npx playwright test --report=list`

```js
// playwright.config.js
reporter: "list";

// for multiple report to generate
reporter: [["list"], ["dot"], ["html"]];

// reporter configuration settings
reporter: [
  // 1. Your customized HTML reporter
  [
    "html",
    {
      open: "never",
      outputFolder: "my-html-report",
      port: 3000,
    },
  ],
  // 2. Terminal-based live logging
  ["list"],
  // 3. JSON Reporter (Requires 'outputFile')
  ["json", { outputFile: "results/test-run.json" }],
  // 4. JUnit XML Reporter for CI/CD gates (Requires 'outputFile')
  ["junit", { outputFile: "results/junit.xml" }],
];
```

## configuration options are

- Open: "always" | "never" | "on-failure"
- host: 8080
- outputFolder: "folder_name"
- outputFile:"results/test-run.json"

## Allure Report

Allure report can be generated using allure npm package.

Steps to create allure report

- Install `pnpm add -D @playwright/test allure-playwright`
- add this `reporter:[['allure-playwright', {resultsDir:'my-allure-results'}]]` to `playwright.config.js`
- Install `CLI` command to run allure report as `pnpm install -g allure-commandline --save-dev`
- Run test and then run this command `allure generate my-allure-results -o allure-report --clean`
- To open allure report run this `allure open allure-report`

# 🤖 Selenium Reporting

Allure report used in selenium

---

# 🎭 Mouse, Keyboard Actions in Playwright

In Playwright, mouse and keyboard actions are available directly on the `locator` (high level) or on `page.mouse` / `page.keyboard` (low level). The common actions are:

- hover
- hover and click
- right click
- double click
- drag and drop
- click and hold
- keyboard actions

> Note: Unlike Selenium, Playwright does **not** have an `Actions` builder class. Each action is its own auto-waiting method on the locator, so you don't need a `perform()` call at the end.

## Mouse Hover

Used to hover over a dropdown, tooltip, or help text so it becomes visible.

```js
await page.locator("#help").hover();
```

## Right Click

Right click on any element using the `button` option.

```js
await page.locator("#rightClickBtn").click({ button: "right" });
```

The `button` option accepts:

- `left` (default)
- `right`
- `middle`

## Double Click

To perform a double click we use the `dblclick()` method.

```js
await page.locator("#db-click").dblclick();
```

## Drag and Drop

Playwright provides a built-in method `source.dragTo(target)`. There is also a low-level manual approach using `page.mouse`.

```js
const source = page.locator("#src");
const target = page.locator("#trg");

// Approach 01 - manual (low level)
await source.hover();
await page.mouse.down(); // press mouse on source

await target.hover();
await page.mouse.up(); // release on target

// Approach 02 - built in (preferred)
await source.dragTo(target);
```

## Keyboard actions

Playwright handles keys with `page.keyboard.press()`. Shortcuts are written with `+`.

```js
// Shortcut / multiple keys together
await page.keyboard.press("Control+A");
await page.keyboard.press("Shift+A");

// Single key
await page.keyboard.press("a");
await page.keyboard.press("Enter");

// Type a whole string character by character (fires individual key events)
// `type()` is deprecated, use `pressSequentially()` instead
await page.locator("#search").pressSequentially("kundalik", { delay: 100 });
```

> `press()` is one key/shortcut at a time. `pressSequentially()` types a full string character by character and fires real key events (the `delay` option, in ms, adds a pause between each key — useful for inputs that react on every keystroke). It replaces the deprecated `type()`. To fill a field quickly without per-key events, prefer `locator.fill("text")`.

# 🤖 Actions in Selenium Java

In Selenium all these actions are performed using the `Actions` class.

```java
Actions act = new Actions(driver);
```

- The `Actions` class supports **method chaining**.
- It follows the **builder pattern**.
- We can chain multiple actions together, but to actually run them we must call `perform()` at the end.
- Chaining makes complex operations readable and efficient.

> Note: each block below is a **standalone example** of one gesture. If you ever run several gestures back-to-back on the **same** `act` instance, remember Selenium accumulates queued actions and `perform()` does not clear them — so use a fresh `Actions` instance per gesture in real tests. `Duration.ofSeconds(...)` needs `import java.time.Duration;`.

```java
WebDriver driver = new ChromeDriver();
Actions act = new Actions(driver);

WebElement element = driver.findElement(By.id("help"));

// Mouse hover
act.moveToElement(element)
   .perform();

// Hover and click
act.moveToElement(element)
   .click()
   .perform();

// Right click
act.contextClick(element)
   .perform();

// Double click
act.doubleClick(element)
   .perform();

// Click and hold
act.clickAndHold(element)
   .perform();

// Click, hold, then release
act.clickAndHold(element)
   .pause(Duration.ofSeconds(2))
   .release()
   .perform();
```

## Drag and Drop

To drag and drop we use the `dragAndDrop(source, target)` method with the source and target elements.

```java
WebElement source = driver.findElement(By.id("src"));
WebElement target = driver.findElement(By.id("trg"));

act.dragAndDrop(source, target)
   .perform();
```

Sometimes `dragAndDrop(src, trg)` won't work because of custom JS-based drag scripts that Selenium's method cannot capture. In that case use the manual click-hold-move-release approach:

```java
WebElement source = driver.findElement(By.id("src"));
WebElement target = driver.findElement(By.id("trg"));

act.clickAndHold(source)
   .moveToElement(target)
   .release()
   .perform();
```

## Move using co-ordinates

To drag by a pixel offset instead of to a target element:

```java
act.dragAndDropBy(source, xOffset, yOffset)
   .perform();
```

Here `xOffset` and `yOffset` are the distances to move in `px`.

## KeyPress in Selenium

The `Keys` enum is used to perform keyboard operations in Selenium.

```java
import org.openqa.selenium.Keys;

WebElement searchLoc = driver.findElement(By.name("q"));

act.sendKeys(searchLoc, "kundalik")
   .sendKeys(Keys.ENTER)
   .perform();
```

- `keyDown()` => simulates pressing and holding a key.
- `keyUp()` => simulates releasing the held key.

### Performing Ctrl + A

```java
act.keyDown(Keys.CONTROL)   // press & hold Ctrl
   .sendKeys("a")           // press A
   .keyUp(Keys.CONTROL)     // release Ctrl
   .perform();
```

## Interview Questions

### Q - Why do we use keyDown before keyUp?

Ans:-

- `keyDown()` presses and holds the key.
- `keyUp()` releases the held key.
- This mimics how a real user interacts: they press and hold the first key, press the second key, then release. Without `keyUp`, the key stays logically held down.

### Q - Why does Selenium need perform() but Playwright does not?

Ans:-

- Selenium's `Actions` uses the builder pattern — it only builds a queue of actions; `perform()` actually executes them.
- Playwright actions are individual auto-waiting methods that execute immediately when awaited, so no `perform()` is needed.

### Q - Difference between dragTo / dragAndDrop and the manual approach?

Ans:-

- The built-in method is one line and works for standard HTML drag.
- The manual approach (hover/down/move/up) is used when the built-in method fails on custom JS drag-and-drop implementations.

### Q - hover() use cases?

Ans:-

- Revealing hidden menus, dropdowns, tooltips, or help text that only appear on hover.

## Action Methods Comparison

| Action               | Playwright                                          | Selenium (Java)                                                         |
| -------------------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| Hover                | `locator.hover()`                                   | `act.moveToElement(el).perform()`                                       |
| Hover + click        | `locator.hover()` then `locator.click()`            | `act.moveToElement(el).click().perform()`                               |
| Right click          | `locator.click({ button: "right" })`                | `act.contextClick(el).perform()`                                        |
| Double click         | `locator.dblclick()`                                | `act.doubleClick(el).perform()`                                         |
| Click and hold       | `page.mouse.down()`                                 | `act.clickAndHold(el).perform()`                                        |
| Release              | `page.mouse.up()`                                   | `act.release().perform()`                                               |
| Drag and drop        | `source.dragTo(target)`                             | `act.dragAndDrop(src, trg).perform()`                                   |
| Move by offset       | `page.mouse.move(x, y)`                             | `act.dragAndDropBy(src, x, y).perform()`                                |
| Press key / shortcut | `page.keyboard.press("Control+A")`                  | `act.keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL).perform()` |
| Type string          | `locator.pressSequentially("text", { delay: 100 })` | `act.sendKeys("text").perform()`                                        |
| Needs perform()      | No (auto executes)                                  | Yes (builder pattern)                                                   |

## Keys Comparison

| Selenium          | Playwright    |
| ----------------- | ------------- |
| `Keys.ENTER`      | `"Enter"`     |
| `Keys.CONTROL`    | `"Control"`   |
| `Keys.SHIFT`      | `"Shift"`     |
| `Keys.TAB`        | `"Tab"`       |
| `Keys.ESCAPE`     | `"Escape"`    |
| `Keys.ARROW_DOWN` | `"ArrowDown"` |

---

# 🎭 Checkbox and Radio

## Radio Button

- Allows single selection.
- You can select only one option within a group.
- Clicking another option automatically deselects the previous one.
- Clicking an active radio button does nothing.
- ⛔ Radio button cannot be manually unchecked once checked. Playwright throws an error.

```html
<input type="radio" />
```

## Checkbox Button

- Allows multi-selection.
- You can select none, one, or multiple options within a group.
- Clicking an active checkbox unchecks it.

```html
<input type="checkbox" />
```

## Methods

- `check()` => `to check` any radio or checkbox
- `uncheck()` => `to uncheck` any radio or checkbox
- `setChecked(checked)` => to check or uncheck based on a boolean value
- `isChecked()` used to know whether it is `checked or not`
- `toBeChecked()` => to check whether it is checked or not
- `toBeEnabled()` => To ensure an element is interactive (not disabled)
- `toBeVisible()` => To verify an element is rendered on the page before trying to click it
- `toBeTruthy()` => check expected condition is true
- `toBeFalsy()` => check expected condition is false

```js
// radio and checkbox check, uncheck, isChecked method
await page.locator("#loc").check();
await page.locator("#loc").uncheck();
await page.locator("#loc").isChecked();

// assertions on checkbox & radios
await expect(await page.locator("#loc").isChecked()).toBeTruthy();
await expect(await page.locator("#loc").isChecked()).toBeFalsy();

// preferred web-first assertion (auto-retries, no manual await needed)
await expect(page.locator("#loc")).toBeChecked();
await expect(page.locator("#loc")).not.toBeChecked();
```

### setChecked()

`setChecked(checked)` is used when the desired state (checked/unchecked) is decided at runtime, e.g. coming from test data, a config flag, or a condition — instead of hard-coding a `check()` or `uncheck()` call. It sets the checkbox/radio to match the boolean passed in, and does nothing if it's already in that state.

```js
// set state dynamically based on a boolean
const shouldBeChecked = true;
await page.locator("#loc").setChecked(shouldBeChecked);

// useful when driving state from test data
for (const item of [
  { loc: "#loc1", checked: true },
  { loc: "#loc2", checked: false },
]) {
  await page.locator(item.loc).setChecked(item.checked);
}
```

## Multi checkBox

To check multiple records we first store them in an array and then perform check operation using a for...of loop.

```js
// Check ops on multiple elements
const allCheckLoc = ["loc1"];

for (const checkLoc of allCheckLoc) {
  await page.locator(checkLoc).check();
}

// Uncheck on checked locators only
for (const checkLoc of allCheckLoc) {
  if (await page.locator(checkLoc).isChecked()) {
    await page.locator(checkLoc).uncheck();
  }
}
```

# 🤖 CheckBox & Radio in Selenium

In Selenium `click()` method is used to `check` and `uncheck` any radio or checkbox.

## Checkbox and Radio Button Method Comparison

| Action / Goal                    | Playwright (JS/TS)                        | Selenium (Java)                                  |
| -------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| Check a Checkbox                 | `locator.check()`                         | `if(!el.isSelected()) el.click();`               |
| Uncheck a Checkbox               | `locator.uncheck()`                       | `if(el.isSelected()) el.click();`                |
| Select a Radio Button            | `locator.check()`                         | `if(!el.isSelected()) el.click();`               |
| Get Selection State              | `await locator.isChecked()`               | `element.isSelected()`                           |
| Assert State is Checked          | `await expect(locator).toBeChecked()`     | `assertTrue(element.isSelected());`              |
| Assert State is Unchecked        | `await expect(locator).not.toBeChecked()` | `assertFalse(element.isSelected());`             |
| Verify if Clickable / Enabled    | `await locator.isEnabled()`               | `element.isEnabled()`                            |
| Force Check (Bypass UI overlays) | `locator.check({ force: true })`          | `js.executeScript("arguments[0].click();", el);` |

## Key Behavioral Differences

| Behaviour           | Playwright                                                                | Selenium                                                             |
| ------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `Check / Uncheck`   | Idempotent — won't click if already in the target state.                  | `click()` always toggles state; needs a manual `isSelected()` guard. |
| `Radio vs Checkbox` | Same `.check()` API works for both radios and checkboxes.                 | `.click()` used for everything, no distinction.                      |
| `Selection State`   | `isChecked()` returns a `Promise<boolean>` (must `await`).                | `isSelected()` returns a plain `boolean` synchronously.              |
| `Assertions`        | `toBeChecked()` is web-first and auto-retries until true or timeout.      | `assertTrue`/`assertFalse` check the state once, immediately.        |
| `Enabled Check`     | Auto-checks actionability (enabled, visible, stable) before every action. | Requires an explicit `isEnabled()` call; no auto-waiting.            |
| `Force Actions`     | `{ force: true }` option bypasses actionability checks.                   | No equivalent option; falls back to `JavascriptExecutor`.            |

---

# 🎭 Playwright Concepts

## Synchronous and Asynchronous in Playwright Locators

Creating a Playwright locator is just like creating an object or variable in JavaScript. It stays inside the Node.js memory and does nothing with the browser, so creating it is **synchronous** — no `await` needed.

A locator is just a variable that holds a **description of how to find a web element**, stored in memory.

```js
const username = page.locator("#username");
```

But when we perform an action on the locator it becomes **asynchronous** because:

- Playwright starts interacting with the browser using its APIs.
- Those APIs take time, so the call becomes async, and to wait for the promise to resolve we use `await`.

```js
await username.click();
```

### Storing the locator in memory

```js
const username = page.locator("#username");
```

- When this line runs, Playwright does nothing with the browser.
- It just stores the locator by creating a varriable in node js memory.
- No network call to the browser.
- No DOM query happens.
- No searching of the page.
- It only creates a JavaScript object in memory.

### Performing action locator

```js
await username.click();`
```

- When the user performs an action on the locator, the real work starts.
- Playwright starts interacting with the browser using its APIs over a WebSocket connection.
- Playwright sends a message over the WebSocket, then
- The browser starts searching the DOM for the locator.
- For searching the locator in DOM we required to wait for the network call to complete.
- So we use `await` to wait until the element is:
  - attached
  - visible
  - stable
  - enabled
  - editable
- All this communication happens via IPC (Inter-Process Communication) over CDP (Chrome DevTools Protocol), which takes time and happens over the network — asynchronous in nature.

> Key point: Playwright resolves the locator **at the time of the action**, not when it is created. This is why Playwright does not throw `StaleElementReferenceException` like Selenium — the element is freshly queried every time you act on it.

| Parameter           | Selenium                  | Playwright                      |
| ------------------- | ------------------------- | ------------------------------- |
| findElement/locator | immediately queries DOM   | stores as a reference in memory |
| returns             | actual element reference  | a lazy locator object           |
| sync or async       | sync                      | sync (stays in Node process)    |
| stale element click | Yes => uses old reference | No => queries at time of action |

---

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

---

# 🎭 File Upload in Playwright

- File Upload in automation testing is possible only on Web Application.
- Playwright or Selenium can't handle desktop based application for that we need to use third party tools (for selenium `autoit` and `robot class`)
- In Playwright we directly set file path reference into `<input type='file'/>`

## File Uploads

- Single file upload
- Multiple file upload
- custome file upload

## Single file Uplaod

- Click on file upload input or button element.
- wait for dialog to open
- assert file upload dialog opens
- use `setInputFiles()` method to set file path directly.

```js
await page.locator("#file-btn").click();
await page.locator("file-Upload-box").setInputFiles(["file_relative_path"]);
```

## Multiple file Uplaod

To upload multiple files we use array and place each file path into that array.

```js
await page.locator("#file-btn").click();
await page
  .locator("file-Upload-box")
  .setInputFiles(["file_relative_path", "another_file.pdf"]);
```

## custome file upload

- for custome file upload use `filechooser` event listener (in lower-case)
- use `setFiles` methods instead of `setInputFiles()`

### Aprroach 01 - recommended

Wrap the event trigger and click action inside Promise.all

```js
const [fileChooser] = await Promise.all([
  page.waitForEvent("filechooser"), // listens filechooser
  page.locator("btn").click(), // Triggers the hidden/custom file dialog
]);

// 2. Pass the file using setFiles
await fileChooser.setFiles("file_relative_path.pdf"); // FileChooser uses setFiles()
```

### Approach 02 - normal approach

```js
const fileChooserPromise = page.waitForEvent("filechooser");
await page.locator("btn").click();
const fileChooser = await fileChooserPromise;
await fileChooser.setFiles("file_relative_path.pdf");
```

## Remove set files

Make array as empty.

```js
await page.locator("#file-btn").click();
await page.locator("file-Upload-box").setInputFiles([]);
```

# 🤖 File Uplaod in Selenium

- Always inspect file upload element and if it is a input tag with `type=file` then use `sendKeys` method.
- If application is not using `input` tag then use `third party tools` such as: `autoIt` `robotclass` `javascript executor` for hidden files

```js
<input type='file' id="file-upload-btn"/>

WebElement fileUploadBtn = driver.findElement(By.Id("#file-upload-btn"));
fileUploadBtn.sendKeys("file_path.pdf")
```

## Hidden input tag for file upload

```htmls
<input type='file' style="display:hiddent">
```

To handle this situation we use javascript executor.

```java
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript(
    "argument[0].style.display='block';",
    uploadElement
)
uploadElement.sendKeys("file_relative_path.pdf")
```

> For multiple file upload in selenium use sendkey with `\n` to seperate file path

## Interview Questions

#### Q1: What if the <input type="file"> element is completely hidden or has display: none?

Answer:

- Playwright’s setInputFiles() works perfectly on hidden input elements.
- Unlike Selenium—which might throw an `ElementNotInteractableException`
- Playwright bypasses visibility restrictions for file inputs because it interacts with the browser's lower-level protocols.
- No need to execute custom JavaScript to force the element to become visible.

#### Q2: How do you automate uploading multiple files simultaneously?

Answer:

- Pass an array of string paths to the `setInputFiles()` method, provided the underlying HTML input attribute has the multiple flag enabled.

```js
// Uploading multiple files
await page
  .locator('input[type="file"]')
  .setInputFiles(["path/file1.pg", "path/file2.png"]);
```

#### Q3: Best practice question: How should you store file paths in your framework?

Answer:

- We Never use hardcoded absolute paths (like C:/Users/Name/Documents/file.txt) because they will fail instantly in CI/CD pipelines (like Jenkins or GitHub Actions).
- Always place test files inside a folder within project repository (e.g., a test-data/ folder) and resolve paths relatively using Node's native path module:

```js
import path from "path";

// Resolves dynamically regardless of operating system or machine running it
const filePath = path.resolve(__dirname, "../test-data/sample.pdf");
await page.locator('input[type="file"]').setInputFiles(filePath);
```

---

# 🎭 File Download in Playwright

In Playwright for file download scenario we

- Validate the file dowanload by intercepting the browser's `download` event rather than waiting for an OS dialog.
- To verify file name we use `download.suggestedFilename()` method

## Methods present on `dowanload` event

- `saveAs(path)` => to save downloaded file into required location. Else it will be deleted once test execution ends.
- `suggestedFilename()` => to check filename just downloaded.
- `cancel()` => to cancel downloading file after validations done to reduce bandwidth of server
- `failure()` => to validate the download failure reason `canceled` for canceled download

### Approach 01

```js
import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test("Validate file download lifecycle", async ({ page }) => {
  // 1. Set up the listener before triggering the download
  const downloadPromise = page.waitForEvent("download");

  // 2. Click the element that initiates the download
  await page.locator("#download-invoice-btn").click();

  // 3. Wait for the download process to complete
  const download = await downloadPromise;

  // 4. Validate the suggested filename
  const fileName = download.suggestedFilename();
  expect(fileName).toBe("invoice_2026.pdf");

  // 5. Save the file to a permanent local directory
  const savePath = path.join(__dirname, "../downloads/", fileName);
  await download.saveAs(savePath);

  // 6. Verify the file actually exists on the hard drive
  expect(fs.existsSync(savePath)).toBeTruthy();
});
```

### Approach 02 - Promise all (recommended)

```js
import { test, expect } from "@playwright/test";

test("Safely intercept and cancel download using Promise.all", async ({
  page,
}) => {
  // 1. Await both the event listener registration and the click action simultaneously
  const [download] = await Promise.all([
    page.waitForEvent("download"), // Set up the network listener
    page.locator("#download-heavy-file").click(), // Trigger the actual download event
  ]);

  // 2. Actively abort the download stream mid-air
  await download.cancel();

  // 3. Verify that the network stream was successfully terminated
  const failureReason = await download.failure();
  expect(failureReason).toBe("canceled");
});
```

## Critical Interview Points to Highlight

- Why `page.waitForEvent('download')` must come first => else we could miss the download event
- Temporary vs. Permanent Storage => `download.saveAs(path)` to save downloaded file else browser will delete once it close
- Bypassing Large Downloads => we use`download.cancel()` method once file name is validated to reduce newtork bandwidth

## Interview Questions

#### Q1: What happens if a download fails due to a network drop? How do you catch that?

Answer:

- You check for errors using the `download.failure()` method.
- If the download completes successfully, it returns `null`.
- If it fails, it `returns a string` describing the network or `server error`.

```js
const failureReason = await download.failure();
if (failureReason) {
  console.log(`Download failed because: ${failureReason}`);
}
```

#### Q2: How do you verify the internal text content of a downloaded PDF or CSV file?

Answer:

- Playwright handles the browser mechanics, but checking the inside of files `requires` regular `Node.js` packages.
- Once downloaded file saved via `download.saveAs()`
- Wwe use standard npm packages like `csv-parse for CSV` files or `pdf-parse for PDFs` to read the file contents directly from the hard drive and pass them to standard assertions.

---
