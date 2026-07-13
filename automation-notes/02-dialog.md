# Dialog

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
- `d.page()` => 🚫
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

## page in dialog handler

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
| `d.defaultValue()`           | no direct equivalent                           |
