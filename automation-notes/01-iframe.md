# iFrame

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

# iFrame in selenium

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
