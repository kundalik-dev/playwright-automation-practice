# Windows & Tab in Playwright

- In playwright tabs and windows handled by using `browserContext`
- No need to switch context between tabs to perform ops in playwright like in selenium.
- Playwright won't differentiate between tab and windows they consider all are pages.

## Tabs/Windows

- Single Tab
- Multiple Tabs

## Handling Single Page

```js
test("single tab",asunc({page})=>{

const browser = await chromium.launch();
const context = await browser.newContext();

// To create new page from context
const page1 = await context.newPage();
const page2 = await context.newPage();

// To know how many pages are present
const allPages = await context.pages();
console.log(`Number of pages are - ${allPages.length()}`)
})
```

## Handling Multiple Pages

```js
// Handling multiple pages using page event handler
const pagePromise = context.waitForEvent("page");
const newPage = await pagePromise();
await newPage.waitForLoadState();

// Approach 02
const [newPage] = await Promise.all([
  context.waitForEvent("page"),
  link.click(),
]);

await newPage.waitForLoadState();

// approach 03
const [newPage] = await Promise.all([page.waitForEvent("popup"), link.click()]);
// Close page
browser.close();
```

## Tabs & Windows In Selenium

- In selenium tabs and windows are identified by unique identifier
- Tab switching done by `switchTo()` method
- To get current current tab `get

- `getWindowHandle()` → current window's handle (single string)
- `getWindowHandles()` → all open handles (a Set)
- `switchTo().window(handle)` → switch the driver's focus to a handle

```java
// WindowHandling.java
String originalWindow = driver.getWindowHandle();

// Trigger an action that opens a new tab/window
driver.findElement(By.linkText("Open new tab")).click();

// Wait until a second window/tab appears
new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(d -> d.getWindowHandles().size() == 2);

// Switch to the new window
for (String handle : driver.getWindowHandles()) {
    if (!handle.equals(originalWindow)) {
        driver.switchTo().window(handle);
        break;
    }
}

// Do work in the new window
System.out.println(driver.getTitle());

// Close it and switch back
driver.close();
driver.switchTo().window(originalWindow);
```

## Csharp selenium

```c#
// WindowHandling.cs
string originalWindow = driver.CurrentWindowHandle;

// Trigger an action that opens a new tab/window
driver.FindElement(By.LinkText("Open new tab")).Click();

// Wait until a second window/tab appears
new WebDriverWait(driver, TimeSpan.FromSeconds(10))
    .Until(d => d.WindowHandles.Count == 2);

// Switch to the new window
foreach (string handle in driver.WindowHandles)
{
    if (handle != originalWindow)
    {
        driver.SwitchTo().Window(handle);
        break;
    }
}

// Do work in the new window
Console.WriteLine(driver.Title);

// Close it and switch back
driver.Close();
driver.SwitchTo().Window(originalWindow);
```

### Selenium 4 changes

```c#
// WindowHandling.cs and .java is same just text casing difference
driver.SwitchTo().NewWindow(WindowType.Tab);    // new tab, auto-focused
driver.SwitchTo().NewWindow(WindowType.Window); // new window, auto-focused
```

| Java                        | C#                          |
| --------------------------- | --------------------------- |
| `getWindowHandle()`         | `CurrentWindowHandle`       |
| `getWindowHandles()`        | `WindowHandles`             |
| `switchTo().window(h)`      | `SwitchTo().Window(h)`      |
| `switchTo().newWindow(...)` | `SwitchTo().NewWindow(...)` |
| `close()`                   | `Close()`                   |
| `quit()`                    | `Quit()`                    |

`getWindowHandles()` ordering is not guaranteed. Don't assume index [1] is the newest tab. Diff against your saved original handle, as shown above.

```java
// WindowHandling.java
Set<String> before = driver.getWindowHandles();

driver.findElement(By.linkText("Open new tab")).click();

new WebDriverWait(driver, Duration.ofSeconds(10))
    .until(d -> d.getWindowHandles().size() > before.size());

Set<String> after = driver.getWindowHandles();

after.removeAll(before);

String newWindow = after.iterator().next();
driver.switchTo().window(newWindow);
```

## Imp Notes

- Context emits page event
- page emits popup event
- context => page => popup
- both of these are valid ways to create new page
- order of placing event handler first then click ops is must

```js
// page-level
const [newPage] = await Promise.all([page.waitForEvent("popup"), link.click()]);

// context-level (also fine)
const [newPage] = await Promise.all([
  context.waitForEvent("page"),
  link.click(),
]);
```

## Rules

- Always validate the current tab using title or URL
-
