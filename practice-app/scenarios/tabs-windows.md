# Tabs & Windows — Practice Scenarios

**App URL:** `http://localhost:3000/tabs-windows/index.html`  
**Pages:** `index.html` · `popup.html` · `new-tab.html`

---

## Scenario 1 — Basic New Tab via Anchor Link
**Level:** Beginner  
**Concept:** `waitForEvent('popup')` / handle diff in Selenium  
**Section:** 1. Anchor `target="_blank"`

### Steps
1. Navigate to `http://localhost:3000/tabs-windows/index.html`
2. Set up a popup listener **before** clicking (Playwright) or store current handle (Selenium)
3. Click **"Open Product Tab"** (`[data-testid="link-product-tab"]`)
4. Switch context to the new tab/page
5. Assert the new tab title contains `"Product Details"`
6. Assert the URL contains `/tabs-windows/new-tab.html`
7. Assert the product name heading is visible (`[data-testid="product-name"]`)
8. Close the new tab and switch back to the original page
9. Assert the original page heading `"Tabs & Windows"` is still visible

### Expected Result
- A new tab opens with the product page
- The original tab remains intact after the new tab is closed
- No extra windows remain open

### Playwright Code Hint
```js
const [newTab] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('[data-testid="link-product-tab"]')
]);
await expect(newTab).toHaveTitle(/Product Details/);
await expect(newTab.locator('[data-testid="product-name"]')).toBeVisible();
await newTab.close();
await expect(page.getByRole('heading', { name: 'Tabs & Windows' })).toBeVisible();
```

### Selenium Code Hint
```java
String mainHandle = driver.getWindowHandle();
driver.findElement(By.cssSelector("[data-testid='link-product-tab']")).click();
Set<String> handles = driver.getWindowHandles();
String newHandle = handles.stream().filter(h -> !h.equals(mainHandle)).findFirst().get();
driver.switchTo().window(newHandle);
Assert.assertTrue(driver.getTitle().contains("Product Details"));
driver.close();
driver.switchTo().window(mainHandle);
```

---

## Scenario 2 — window.open() Popup Interaction
**Level:** Beginner → Intermediate  
**Concept:** Interact with popup as a separate page object  
**Section:** 2. Programmatic Popup

### Steps
1. Navigate to `http://localhost:3000/tabs-windows/index.html`
2. Set up popup listener / store handles
3. Click **"Open Basic Popup"** (`[data-testid="open-basic-popup"]`)
4. In the popup (`popup.html`):
   - Assert popup title is `"Popup Window"`
   - Assert `[data-testid="window-info"]` contains text `"window.opener: available"`
   - Fill `[data-testid="popup-input"]` with text `"Hello from test"`
   - Click **"Submit"** (`[data-testid="popup-submit"]`)
   - Assert `[data-testid="popup-result"]` contains `"Submitted: \"Hello from test\""`
5. Click **"Close Popup"** (`[data-testid="popup-close-btn"]`)
6. Assert popup is closed (context has only 1 page / handle count is 1)

### Expected Result
- Popup opens with opener reference available
- Input → Submit → result correctly reflects submitted value
- Closing popup returns to single page state

### Playwright Code Hint
```js
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('[data-testid="open-basic-popup"]')
]);
await expect(popup).toHaveTitle('Popup Window');
await expect(popup.locator('[data-testid="window-info"]')).toContainText('window.opener: available');
await popup.fill('[data-testid="popup-input"]', 'Hello from test');
await popup.click('[data-testid="popup-submit"]');
await expect(popup.locator('[data-testid="popup-result"]')).toContainText('Submitted: "Hello from test"');
await popup.click('[data-testid="popup-close-btn"]');
await expect(popup.isClosed()).toBeTruthy(); // or waitForEvent('close')
```

---

## Scenario 3 — Named Window Reuse Behavior
**Level:** Intermediate  
**Concept:** Named windows don't multiply — second click reuses same window  
**Section:** 3. Named Window

### Steps
1. Navigate to `http://localhost:3000/tabs-windows/index.html`
2. Click **"Open / Reuse 'reportWindow'"** (`[data-testid="named-window-btn"]`)
3. Assert a new window/page opens (context.pages().length === 2)
4. Assert `[data-testid="named-window-status"]` contains `"New window opened."`
5. Note the URL of the opened window (should be `/tabs-windows/new-tab.html`)
6. Click **"Navigate 'reportWindow' → popup.html"** (`[data-testid="named-window-alt-btn"]`)
7. Assert context still has exactly 2 pages (no new window created)
8. Assert `[data-testid="named-window-status"]` contains `"Reused existing window"`
9. Assert the named window URL now contains `popup.html`

### Expected Result
- Second click navigates the **same** window instead of opening a new one
- Total window count stays at 2 throughout

### Key Interview Point
> `window.open(url, 'name')` — the window name acts as an identifier. If a window with that name is already open in the same browsing context, it is reused. This is why a "Login" popup that calls `window.open('/auth', 'authWindow')` will never open more than one auth popup per tab.

---

## Scenario 4 — Multiple Windows: Open, Switch, Close Specific
**Level:** Intermediate  
**Concept:** Managing an array/set of open windows  
**Section:** 4. Multiple Windows Management

### Steps
1. Navigate to `http://localhost:3000/tabs-windows/index.html`
2. Click **"Open Window 1"** → assert 1 extra window open
3. Click **"Open Window 2"** → assert 2 extra windows open
4. Click **"Open Window 3"** → assert `[data-testid="windows-count-box"]` shows `"Open windows: 3"`
5. Switch to Window 2 (second opened popup)
   - Assert title contains `"Product Details"`
   - Assert URL contains `product=2`
   - Assert `[data-testid="product-name"]` contains `"Ergonomic Office Chair"`
6. Close **only** Window 2 from inside that window
7. Back on main page, assert count box shows `"Open windows: 2"`
8. Assert the list item for Window 2 shows `"closed"` status
9. Click **"Close All"** → assert all windows closed → count shows `"Open windows: 0"`

### Expected Result
- Each window is independently tracked
- Closing Window 2 does not affect Windows 1 and 3
- Close All successfully closes all remaining windows

### Playwright Code Hint
```js
// Open 3 windows
for (const testid of ['open-window-1', 'open-window-2', 'open-window-3']) {
  const [newPage] = await Promise.all([page.waitForEvent('popup'), page.click(`[data-testid="${testid}"]`)]);
}
await expect(page.locator('[data-testid="windows-count-box"]')).toContainText('Open windows: 3');

// Switch to Window 2
const window2 = context.pages().find(p => p.url().includes('product=2'));
await expect(window2.locator('[data-testid="product-name"]')).toContainText('Ergonomic Office Chair');
await window2.close();

await expect(page.locator('[data-testid="windows-count-box"]')).toContainText('Open windows: 2');
```

---

## Scenario 5 — OAuth Popup Authentication Flow
**Level:** Advanced  
**Concept:** Popup closes after auth; main page receives token via postMessage  
**Section:** 5. Auth Popup Flow

### Steps
1. Navigate to `http://localhost:3000/tabs-windows/index.html`
2. Assert `[data-testid="auth-status"]` contains `"Not Authenticated"`
3. Set up popup listener / store handles
4. Click **"Login with OAuth"** (`[data-testid="oauth-login-btn"]`)
5. In the OAuth popup (`popup.html?mode=auth`):
   - Assert title is `"OAuth Login"`
   - Assert email field (`[data-testid="auth-email"]`) has default value `"test@example.com"`
   - Clear password field (`[data-testid="auth-password"]`) and type `"password123"`
   - Click **"Authenticate"** (`[data-testid="authenticate-btn"]`)
   - Assert status shows `"Authenticating — please wait…"`
6. Wait for popup to **close** automatically
7. Back on main page:
   - Assert `[data-testid="auth-status"]` now contains `"Authenticated as test@example.com"`
   - Assert `[data-testid="auth-result"]` contains `"Token:"`
   - Assert `[data-testid="logout-btn"]` is visible
   - Assert `[data-testid="oauth-login-btn"]` is hidden
8. Click **"Logout"** → assert status returns to `"Not Authenticated"`

### Expected Result
- Popup closes automatically after auth (no manual close needed)
- Main page auth state updates via postMessage without a page reload
- Token is shown in the result box

### Playwright Code Hint
```js
await expect(page.locator('[data-testid="auth-status"]')).toContainText('Not Authenticated');

const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('[data-testid="oauth-login-btn"]')
]);

await popup.fill('[data-testid="auth-password"]', 'password123');
await popup.click('[data-testid="authenticate-btn"]');
await popup.waitForEvent('close');  // wait for popup to self-close

await expect(page.locator('[data-testid="auth-status"]')).toContainText('Authenticated as test@example.com');
await expect(page.locator('[data-testid="auth-result"]')).toContainText('Token:');
await expect(page.locator('[data-testid="logout-btn"]')).toBeVisible();
```

### Edge Case — Wrong Password
- Enter `"wrong"` as password → assert error `[data-testid="auth-error"]` is visible with "Invalid credentials"
- Popup should **not** close on wrong credentials

---

## Scenario 6 — Cross-Window postMessage Round-Trip
**Level:** Advanced  
**Concept:** Bidirectional communication between pages  
**Section:** 6. Cross-Window Communication

### Steps
1. Navigate to `http://localhost:3000/tabs-windows/index.html`
2. Click **"Open Communication Popup"** (`[data-testid="open-comms-popup"]`)
3. Assert `[data-testid="comms-log"]` on main page contains `"Opened communication popup"`
4. Fill `[data-testid="msg-input"]` with `"Ping from test"`
5. Click **"Send to Popup"** (`[data-testid="send-msg-btn"]`)
6. Assert main log contains `→ Sent to popup: "Ping from test"`
7. In the popup (`popup.html?mode=comms`):
   - Assert `[data-testid="incoming-messages"]` contains `"← From main: \"Ping from test\""`
   - Fill `[data-testid="popup-msg-input"]` with `"Pong from popup"`
   - Click **"Send to Main"** (`[data-testid="popup-send-btn"]`)
8. Back on main page, assert `[data-testid="comms-log"]` contains `← Received from popup: "Pong from popup"`

### Expected Result
- Full round-trip message passing works (main → popup → main)
- `aria-live="polite"` region updates are assertable with `toContainText`

### Playwright Code Hint
```js
const [commsPopup] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('[data-testid="open-comms-popup"]')
]);

await page.fill('[data-testid="msg-input"]', 'Ping from test');
await page.click('[data-testid="send-msg-btn"]');
await expect(commsPopup.locator('[data-testid="incoming-messages"]')).toContainText('Ping from test');

await commsPopup.fill('[data-testid="popup-msg-input"]', 'Pong from popup');
await commsPopup.click('[data-testid="popup-send-btn"]');
await expect(page.locator('[data-testid="comms-log"]')).toContainText('Pong from popup');
```

---

## Quick Reference — Key Locators

| Element | Locator Strategy | Selector |
|---|---|---|
| Open Product Tab link | id + testid + aria | `[data-testid="link-product-tab"]` |
| View Report link | role + text | `getByRole('link', {name:'View Report'})` |
| Documentation link | dynamic attr | `[data-action="open-docs-tab"]` |
| Open Basic Popup btn | id | `#btn-basic-popup` |
| Open Window 2 btn | testid + dynamic | `[data-testid="open-window-2"]` or `[data-window-id="2"]` |
| Auth status badge | role (status) | `[data-testid="auth-status"]` or `getByRole('status')` |
| Close All Windows | id | `#close-all-btn` |
| Popup input | name | `getByRole('textbox', {name:'Popup input field'})` |
| Product name (new-tab) | testid | `[data-testid="product-name"]` |
| Product price | testid | `[data-testid="product-price"]` |
| Reviews table | aria | `getByRole('table', {name:'Customer reviews'})` |
| 2nd review row | testid + axes | `[data-testid="review-row-1"]` |
| Window count box | testid | `[data-testid="windows-count-box"]` |
| Comms log | testid + aria | `[data-testid="comms-log"]` (aria-live polite) |

---

## Common Interview Questions Covered

1. **"Why must you set up `waitForEvent('popup')` before the click?"**  
   If the popup opens synchronously before the listener is registered, the event is missed and the promise never resolves. `Promise.all()` registers the listener first, then fires the click.

2. **"How do you switch to a new window in Selenium vs Playwright?"**  
   Selenium: `switchTo().window(handle)`. Playwright: no switch needed — operate directly on the returned `Page` object.

3. **"What happens when you call `window.open(url, 'same-name')` twice?"**  
   The browser reuses the existing named window (navigates it) rather than opening a second one. Only one extra entry appears in `context.pages()`.

4. **"How do you wait for a popup to close in Playwright?"**  
   `await popup.waitForEvent('close')` — async, no polling required.

5. **"What is `window.opener`?"**  
   A reference to the `window` object of the page that opened the popup. Used for `postMessage` in OAuth flows. It is `null` when `rel="noopener"` or `noopener` window feature is set.
