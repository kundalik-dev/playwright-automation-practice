# Playwright Concepts

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

### const username = page.locator("#username");

- When this line runs, Playwright does nothing with the browser.
- It just stores the selector / how-to-find description.
- No network call to the browser.
- No DOM query happens.
- No searching of the page.
- It only creates a JavaScript object in memory.

### await username.click();

- When the user performs an action on the locator, the real work starts.
- Playwright starts interacting with the browser using its APIs over a WebSocket connection.
- Playwright sends a message over the WebSocket, then
- the browser starts searching the DOM for the locator.
- For this we need to wait for the network call to complete.
- So we use `await` to wait until the element is:
  - attached
  - visible
  - stable
  - enabled
  - editable
- All this communication happens via IPC (Inter-Process Communication) over CDP (Chrome DevTools Protocol), which takes time and happens over the network — asynchronous in nature.

> Key point: Playwright resolves the locator **at the time of the action**, not when it is created. This is why Playwright does not throw `StaleElementReferenceException` like Selenium — the element is freshly queried every time you act on it.

| Parameter           | Selenium                  | Playwright                        |
| ------------------- | ------------------------- | --------------------------------- |
| findElement/locator | immediately queries DOM   | stores as a reference in memory   |
| returns             | actual element reference  | a lazy locator object             |
| sync or async       | sync                      | sync (stays in Node process)      |
| stale element click | Yes => uses old reference | No => queries at time of action   |
