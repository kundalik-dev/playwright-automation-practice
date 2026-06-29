# Annotations — Practice Scenarios

**App URL:** `http://localhost:3000/annotations/index.html`

---

## Scenario 1 — `test.skip()`: Skip Test Based on Feature Flag
**Level:** Beginner  
**Annotation:** `test.skip(condition, 'reason')` / TestNG: `throw new SkipException()`  
**Section:** 1. Feature Flags & Environment Conditions

### Context
The Beta UI section (`[data-testid="beta-panel"]`) only appears when the "Beta UI" toggle is ON.
A test that validates beta features must skip when the flag is OFF.

### Steps
1. Navigate to `http://localhost:3000/annotations/index.html`
2. Read the current state of `[data-testid="toggle-beta-ui"]` (`aria-checked` attribute)
3. **If** `aria-checked === "false"` → test should call `test.skip(true, 'Beta UI flag is OFF')`
4. **If** `aria-checked === "true"` → proceed with the test
5. Toggle "Beta UI" ON by clicking `[data-testid="toggle-beta-ui"]`
6. Assert `[aria-checked="true"]` on the toggle
7. Assert `[data-testid="beta-panel"]` is visible (`toBeVisible()`)
8. Assert `[data-testid="beta-panel"]` contains text `"Beta Feature Visible"`
9. Assert `[data-testid="btn-beta-action"]` is visible and enabled
10. Click "Switch to Production" (`[data-testid="btn-switch-env"]`)
11. Assert `[data-testid="env-badge"]` contains `"Production"`

### Expected Result
- Beta panel hidden by default → test skips
- When flag is toggled ON → test runs and panel is visible
- Environment badge updates correctly

### Playwright Code Hint
```js
const isBetaOn = await page.locator('[data-testid="toggle-beta-ui"]').getAttribute('aria-checked') === 'true';
test.skip(!isBetaOn, 'Beta UI flag is OFF — skipping beta-only test');

// If flag is on:
await expect(page.locator('[data-testid="beta-panel"]')).toBeVisible();
await expect(page.locator('[data-testid="beta-panel"]')).toContainText('Beta Feature Visible');
```

### Selenium (TestNG) Code Hint
```java
boolean isBeta = driver.findElement(By.cssSelector("[data-testid='toggle-beta-ui']"))
                       .getAttribute("aria-checked").equals("true");
if (!isBeta) throw new SkipException("Beta UI flag is OFF");

WebElement panel = driver.findElement(By.cssSelector("[data-testid='beta-panel']"));
Assert.assertTrue(panel.isDisplayed());
Assert.assertTrue(panel.getText().contains("Beta Feature Visible"));
```

### Locator Practice
- Toggle by `id`: `#toggle-dark-mode`
- Toggle by `data-feature` (dynamic): `[data-feature="beta-ui"]`
- Toggle by `aria`: `getByRole('switch', {name:'Beta UI'})`
- Advanced Analytics (no id): `locator('#feature-flags button[role="switch"]').nth(2)` ← axes
- Environment badge: `getByRole('status', {name:/Current environment/})`

---

## Scenario 2 — `test.slow()`: Validate Slow Report Generation
**Level:** Beginner  
**Annotation:** `test.slow()` / TestNG: `@Test(timeOut = 10000)` / JUnit5: `@Timeout`  
**Section:** 2. Slow Operations

### Context
"Generate Report" triggers a 5-second async operation. Without `test.slow()`, the test may timeout
at 30s if there are other slow operations in the same test. This scenario practices the full
wait-for-result pattern after a slow async action.

### Steps
1. Navigate to `http://localhost:3000/annotations/index.html`
2. Call `test.slow()` at the top of the test (triples timeout: 30s → 90s)
3. Assert `[data-testid="report-result"]` is hidden (initial state)
4. Assert `[data-testid="loading-indicator"]` has `aria-busy="false"` (not loading yet)
5. Click **"Generate Report (5s)"** (`[data-testid="btn-gen-report"]`)
6. Assert `[aria-busy="true"]` on `[data-testid="loading-indicator"]` — loading started
7. Assert `[data-testid="loading-label"]` contains text `"Generate sales report"`
8. Assert `[data-testid="progress-bar"]` is visible
9. Wait for `[data-testid="report-result"]` to become visible (web-first assertion waits automatically)
10. Assert `[data-testid="report-table"]` is visible
11. Assert report has exactly 4 rows (`locator('#report-tbody tr').count()`)
12. Assert row 0 contains `"January"` and `"Above target"`
13. Assert `[data-testid="slow-status"]` contains `"done"` with a timestamp

### Expected Result
- Loading state shows `aria-busy="true"` while operation is in progress
- After 5s, report table appears with 4 data rows
- Loading indicator disappears after completion

### Playwright Code Hint
```js
test.slow(); // call this FIRST — triples the timeout

await expect(page.locator('[data-testid="report-result"]')).toBeHidden();
await expect(page.locator('[data-testid="loading-indicator"]')).toHaveAttribute('aria-busy', 'false');

await page.click('[data-testid="btn-gen-report"]');
await expect(page.locator('[data-testid="loading-indicator"]')).toHaveAttribute('aria-busy', 'true');
await expect(page.locator('[data-testid="loading-label"]')).toContainText('Generate sales report');

// Web-first assertion — waits until visible (up to timeout)
await expect(page.locator('[data-testid="report-result"]')).toBeVisible();
await expect(page.locator('#report-tbody tr')).toHaveCount(4);
await expect(page.locator('[data-testid="report-row-0"]')).toContainText('January');
await expect(page.locator('[data-testid="slow-status"]')).toContainText('done');
```

### Selenium (TestNG) Code Hint
```java
@Test(timeOut = 15000)  // 15s explicit timeout
public void testReportGeneration() {
    driver.findElement(By.cssSelector("[data-testid='btn-gen-report']")).click();
    
    // Wait for aria-busy="true"
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));
    WebElement indicator = driver.findElement(By.cssSelector("[data-testid='loading-indicator']"));
    wait.until(d -> indicator.getAttribute("aria-busy").equals("true"));
    
    // Wait for table to appear
    wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    WebElement table = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.cssSelector("[data-testid='report-table']")));
    
    List<WebElement> rows = driver.findElements(By.cssSelector("#report-tbody tr"));
    Assert.assertEquals(rows.size(), 4);
}
```

### Locator Practice
- Button by `id`: `#btn-gen-report`
- Button by `aria-label`: `getByLabel('Generate sales report')`
- Loading indicator by `aria-busy`: `[data-testid="loading-indicator"][aria-busy="true"]`
- Table by `role`: `getByRole('table', {name:'Sales report'})`
- Row by `data-month` (dynamic): `[data-month="january"]`
- Row nth: `locator('#report-tbody tr').nth(0)`

---

## Scenario 3 — `test.fixme()`: Known Buggy Counter
**Level:** Intermediate  
**Annotation:** `test.fixme('BUG-101')` / TestNG: `@Test(enabled=false)`  
**Section:** 3. Known Bugs & Expected Failures

### Context
The "Buggy Counter" increments by 2 instead of 1 (BUG-101). The test that verifies
`counter = 3` after three clicks will fail because the actual value is `6`.
Use `test.fixme()` to mark it as broken so it appears in the report without blocking CI.

### Sub-Scenario A — Mark broken test with `test.fixme()`
1. Navigate to `http://localhost:3000/annotations/index.html`
2. Read initial counter value from `[data-testid="buggy-counter"]` — assert it is `"0"`
3. Click **"+"** (`[data-testid="btn-buggy-inc"]`) 3 times
4. Observe actual counter value is `"6"` (bug: adds 2 each click)
5. Annotate the test: `test.fixme('BUG-101: counter increments by 2 instead of 1')`
6. Your assertion `expect(counter).toHaveText('3')` would fail — but with `test.fixme()` the test is skipped + flagged in report

### Sub-Scenario B — `test.fail()` confirms bug still exists
1. Use `test.fail()` annotation
2. Assert counter shows `"3"` after 3 clicks
3. This assertion FAILS (actual: `"6"`) → but `test.fail()` says that's EXPECTED
4. If someone fixes the bug and counter returns `"3"`, the test will start failing in the OTHER direction → signals bug is fixed, remove `test.fail()`

### Sub-Scenario C — Flaky button retry behavior
1. Click `[data-testid="btn-flaky"]`
2. Assert `[data-testid="flaky-result"]` text — it may show "Success" or "Failed"
3. If it fails 50% of the time → configure `retries: 2` in `playwright.config.js` OR use `test.fixme()`

### Expected Result
- `test.fixme()` test shows as skipped in report with bug reference
- `test.fail()` test passes only when the assertion fails (bug confirmed)
- Decrement works correctly (test without fixme should pass for decrement)

### Playwright Code Hint
```js
// test.fixme() approach
test('counter increments correctly @fixme', async ({ page }) => {
  test.fixme(true, 'BUG-101: counter increments by 2 instead of 1');
  // This test body won't run — but BUG-101 is tracked in the report
  const counter = page.locator('[data-testid="buggy-counter"]');
  for (let i = 0; i < 3; i++) await page.click('[data-testid="btn-buggy-inc"]');
  await expect(counter).toHaveText('3'); // would fail with actual "6"
});

// test.fail() approach — passes only if assertion fails
test('BUG-101 still exists @regression', async ({ page }) => {
  test.fail(); // we EXPECT this test to fail
  const counter = page.locator('[data-testid="buggy-counter"]');
  for (let i = 0; i < 3; i++) await page.click('[data-testid="btn-buggy-inc"]');
  await expect(counter).toHaveText('3'); // fails (actual "6") → test.fail() makes this PASS
});

// Decrement test — should pass (no bug)
test('counter decrement is correct', async ({ page }) => {
  await page.click('[data-testid="btn-buggy-inc"]');
  await page.click('[data-testid="btn-buggy-dec"]');
  await expect(page.locator('[data-testid="buggy-counter"]')).toHaveText('1');
});
```

### Locator Practice
- Increment by `id`: `#btn-inc`
- Counter by `aria`: `getByRole('status', {name:'Counter value'})`
- Counter by `aria-live`: `[aria-live="polite"][role="status"]`
- Bug badge by dynamic: `[data-bug-id="BUG-101"]`
- Flaky by dynamic: `[data-reliability="50pct"]`
- Always-error by dynamic: `[data-outcome="always-error"]`
- Parent card (axes): `locator('[data-testid="bug-tag-101"]').locator('..')`

---

## Scenario 4 — `test.step()`: Multi-Step Checkout Flow
**Level:** Intermediate  
**Annotation:** `test.step('name', async () => …)` / Allure: `@Step`  
**Section:** 4. Multi-Step Flow

### Context
`test.step()` wraps logical groups of actions — each step appears separately in the
Playwright HTML report and trace viewer. When the test fails in Step 2 "Fill shipping form",
you instantly know where the failure is instead of tracing a line number.

### Steps
```
Step 1: "Verify cart" — confirm items and total
Step 2: "Fill shipping form" — enter name, address, zip, shipping method
Step 3: "Enter payment details" — card, expiry, CVV
Step 4: "Place order and confirm" — click submit, verify confirmation
```

**Detailed steps:**

1. Navigate to `http://localhost:3000/annotations/index.html`
2. **Step 1 — Verify cart:**
   - Assert step tab 1 is active (`[data-testid="step-tab-1"]` has class `active`)
   - Assert `[data-testid="step-panel-1"]` is visible
   - Assert `[data-testid="cart-table"]` contains rows for "Wireless Headphones" and "USB-C Hub"
   - Change `[data-testid="cart-qty-1"]` to `2` → assert `[data-testid="cart-total"]` updates
   - Click **"Continue to Shipping →"** (`[data-testid="btn-to-shipping"]`)
3. **Step 2 — Fill shipping form:**
   - Assert `[data-testid="step-tab-1"]` has class `done`
   - Assert `[data-testid="step-panel-2"]` is visible
   - Fill `[data-testid="ship-name"]` with `"Jane Smith"`
   - Fill `[data-testid="ship-address"]` with `"123 Test Ave"`
   - Fill `[data-testid="ship-zip"]` with `"10001"`
   - Select `"express"` in `[data-testid="ship-method"]`
   - Click `[data-testid="btn-to-payment"]`
4. **Step 3 — Enter payment:**
   - Assert `[data-testid="step-panel-3"]` is visible
   - Fill `[data-testid="pay-card"]` with `"4111 1111 1111 1111"`
   - Fill `[data-testid="pay-expiry"]` with `"12/27"`
   - Fill `[data-testid="pay-cvv"]` with `"123"`
   - Click `[data-testid="btn-place-order"]`
5. **Step 4 — Confirm order:**
   - Assert `[data-testid="order-confirmation"]` is visible
   - Assert `[data-testid="order-id"]` text matches `/^ORD-/`

### Expected Result
- Each step panel shows/hides as expected
- Completed steps show `done` styling
- Order confirmation displays with a valid Order ID

### Playwright Code Hint
```js
test('Complete checkout @regression', async ({ page }) => {
  await test.step('Verify cart', async () => {
    await expect(page.locator('[data-testid="step-tab-1"]')).toHaveClass(/active/);
    await expect(page.locator('[data-testid="cart-table"]')).toContainText('Wireless Headphones');
    await page.fill('[data-testid="cart-qty-1"]', '2');
    await page.click('[data-testid="btn-to-shipping"]');
  });

  await test.step('Fill shipping form', async () => {
    await expect(page.locator('[data-testid="step-panel-2"]')).toBeVisible();
    await page.fill('[data-testid="ship-name"]', 'Jane Smith');
    await page.fill('[data-testid="ship-address"]', '123 Test Ave');
    await page.fill('[data-testid="ship-zip"]', '10001');
    await page.selectOption('[data-testid="ship-method"]', 'express');
    await page.click('[data-testid="btn-to-payment"]');
  });

  await test.step('Enter payment details', async () => {
    await page.fill('[data-testid="pay-card"]', '4111 1111 1111 1111');
    await page.fill('[data-testid="pay-expiry"]', '12/27');
    await page.fill('[data-testid="pay-cvv"]', '123');
    await page.click('[data-testid="btn-place-order"]');
  });

  await test.step('Assert order confirmation', async () => {
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-id"]')).toHaveText(/^ORD-/);
  });
});
```

### Locator Practice
- Step tab active: `[data-testid="step-tab-1"]` → assert `.toHaveClass(/active/)`
- Step tab by data-step (dynamic): `[data-step="2"]`
- Cart row by testid: `[data-testid="cart-row-headphones"]`
- Cart qty by name: `getByRole('spinbutton', {name:'Quantity for Wireless Headphones'})`
- Shipping select by aria: `getByLabel('Select shipping method')`
- Card input by aria: `getByLabel('Card number')`
- Order confirmation: `getByRole('status', {name:/Order Placed/})`
- Cart table axes: `locator('[data-testid="cart-table"] tbody tr').filter({hasText:'USB-C Hub'})`

---

## Scenario 5 — `test.each()` / `@DataProvider`: Data-Driven Login
**Level:** Intermediate → Advanced  
**Annotation:** `test.each(data)` / `@DataProvider + @Test(dataProvider=)`  
**Section:** 5. Data-Driven / Parameterized Tests

### Context
The same login test logic runs for 4 different user types. Instead of duplicating code,
use Playwright `test.each()` or TestNG `@DataProvider` to run the test once per user.

### Test Data
| Role    | Email              | Password    | Expected Dashboard Element       |
|---------|-------------------|-------------|----------------------------------|
| Admin   | admin@test.com    | admin123    | `[data-testid="dash-admin"]`     |
| Editor  | editor@test.com   | editor123   | `[data-testid="dash-editor"]`    |
| Viewer  | viewer@test.com   | viewer123   | `[data-testid="dash-viewer"]`    |
| Invalid | bad@test.com      | wrong       | Error message in login-result    |

### Steps (per user row)
1. Navigate to `http://localhost:3000/annotations/index.html`
2. Fill `[data-testid="login-email"]` with the user's email
3. Fill `[data-testid="login-password"]` with the user's password
4. Click `[data-testid="btn-login"]`
5. Assert `[data-testid="login-result"]`:
   - Valid user: contains `"Logged in as {email} (role: {role})"`
   - Invalid user: contains `"Invalid credentials"`
6. For valid users: assert `[data-testid="role-dashboard"]` is visible
7. Assert only the correct dashboard panel is visible:
   - Admin: `[data-testid="dash-admin"]` visible, editor + viewer hidden
   - Editor: `[data-testid="dash-editor"]` visible, admin + viewer hidden
   - Viewer: `[data-testid="dash-viewer"]` visible, admin + editor hidden
8. Assert role-specific buttons (Admin: `[data-testid="admin-manage-users"]`)
9. Click `[data-testid="btn-logout"]` to reset state before next iteration

### Expected Result
- Each user gets correct dashboard
- Invalid user sees error, no dashboard
- Logout restores initial state for clean next iteration

### Playwright Code Hint
```js
const users = [
  { email: 'admin@test.com',  password: 'admin123',  role: 'admin',  dashboard: 'dash-admin'  },
  { email: 'editor@test.com', password: 'editor123', role: 'editor', dashboard: 'dash-editor' },
  { email: 'viewer@test.com', password: 'viewer123', role: 'viewer', dashboard: 'dash-viewer' },
  { email: 'bad@test.com',    password: 'wrong',     role: null,     dashboard: null          },
];

for (const user of users) {
  test(`Login as ${user.role ?? 'invalid user'}`, async ({ page }) => {
    await page.goto('http://localhost:3000/annotations/index.html');
    await page.fill('[data-testid="login-email"]', user.email);
    await page.fill('[data-testid="login-password"]', user.password);
    await page.click('[data-testid="btn-login"]');

    if (user.role) {
      await expect(page.locator('[data-testid="login-result"]')).toContainText(`role: ${user.role}`);
      await expect(page.locator(`[data-testid="${user.dashboard}"]`)).toBeVisible();
    } else {
      await expect(page.locator('[data-testid="login-result"]')).toContainText('Invalid credentials');
      await expect(page.locator('[data-testid="role-dashboard"]')).toBeHidden();
    }
  });
}
```

### TestNG / @DataProvider Code Hint
```java
@DataProvider(name = "loginData")
public Object[][] loginData() {
  return new Object[][] {
    { "admin@test.com",  "admin123",  "dash-admin",  true  },
    { "editor@test.com", "editor123", "dash-editor", true  },
    { "viewer@test.com", "viewer123", "dash-viewer", true  },
    { "bad@test.com",    "wrong",     null,          false },
  };
}

@Test(dataProvider = "loginData")
public void testLogin(String email, String password, String dashId, boolean valid) {
  driver.findElement(By.cssSelector("[data-testid='login-email']")).sendKeys(email);
  driver.findElement(By.cssSelector("[data-testid='login-password']")).sendKeys(password);
  driver.findElement(By.cssSelector("[data-testid='btn-login']")).click();

  if (valid) {
    WebElement dash = driver.findElement(By.cssSelector("[data-testid='" + dashId + "']"));
    Assert.assertTrue(dash.isDisplayed());
  } else {
    String result = driver.findElement(By.cssSelector("[data-testid='login-result']")).getText();
    Assert.assertTrue(result.contains("Invalid credentials"));
  }
}
```

### Locator Practice
- Email by `id`: `#login-email`
- Email by `aria`: `getByLabel('Login email')`
- Password by `name`: `page.locator('[name="password"]')`
- Login button by role+text: `getByRole('button', {name:'Login'})`
- Role table row (dynamic): `[data-role="admin"]`
- Dashboard panel (dynamic): `[data-role-panel="editor"]`
- Credentials table axes: `locator('[data-testid="credentials-table"] tbody tr').filter({hasText:'Viewer'})`
- Admin-only button: `[data-testid="admin-manage-users"]` (should NOT exist for editor/viewer)

---

## Quick Reference — Key Locators

| Element | Strategy | Selector |
|---|---|---|
| Dark mode toggle | id + role | `#toggle-dark-mode` or `getByRole('switch', {name:'Dark Mode'})` |
| Beta UI toggle | testid + dynamic | `[data-testid="toggle-beta-ui"]` or `[data-feature="beta-ui"]` |
| Analytics toggle (no id) | axes | `locator('#feature-flags button[role="switch"]').nth(2)` |
| Beta panel | testid + aria | `[data-testid="beta-panel"]` or `getByLabel('Beta feature panel')` |
| Generate report btn | id + aria | `#btn-gen-report` or `getByLabel('Generate sales report')` |
| Loading indicator | aria-busy | `[data-testid="loading-indicator"][aria-busy="true"]` |
| Report table | role | `getByRole('table', {name:'Sales report'})` |
| Report row nth | axes | `locator('#report-tbody tr').nth(0)` |
| Buggy counter | role+name | `getByRole('status', {name:'Counter value'})` |
| Buggy inc button | id + aria | `#btn-inc` or `getByLabel('Increase counter')` |
| Bug badge | dynamic | `[data-bug-id="BUG-101"]` |
| Flaky button | dynamic | `[data-reliability="50pct"]` |
| Step tab | data-step | `[data-step="2"]` |
| Ship method | aria | `getByLabel('Select shipping method')` |
| Cart row (axes) | testid filter | `locator('[data-testid="cart-table"] tbody tr').filter({hasText:'USB-C'})` |
| Login email | id + aria | `#login-email` or `getByLabel('Login email')` |
| Role dashboard | dynamic | `[data-role-panel="admin"]` |
| Scenario cards | role | `getByRole('list', {name:'Test scenarios'})` |
| Filter by tag | dynamic | `[data-filter="smoke"]` |
| Cards with tag | dynamic substr | `locator('.scenario-card[data-tags*="critical"]')` |

---

## Common Interview Questions Covered

1. **"What is the difference between `test.skip()` and `test.fixme()`?"**  
   `test.skip()` silently skips — nothing appears clearly in report. `test.fixme()` skips AND marks in the report as a known broken test so the team tracks it. Always use `test.fixme()` for bugs, not `test.skip()`.

2. **"When do you use `test.slow()`?"**  
   When the test involves operations that take longer than the default timeout: API-heavy flows, file exports, report generation. It triples the timeout without hardcoding a specific number.

3. **"What does `test.fail()` do — isn't that the same as a failing test?"**  
   `test.fail()` INVERTS the result. The test "passes" only if the assertion inside fails. Use it to confirm a known bug still exists — if the bug is fixed, `test.fail()` will start failing, signalling you to remove the annotation.

4. **"How does `test.step()` help in debugging?"**  
   The Playwright trace viewer and HTML report show each step as a named block. Instead of "failure at line 47", you see "Failed in step: Fill shipping form → invalid ZIP". Much faster to diagnose.

5. **"How do you run only @smoke tests in Playwright vs TestNG?"**  
   Playwright: `npx playwright test --grep "@smoke"`. TestNG: configure testng.xml with `<groups><run><include name="smoke"/></run></groups>`.

6. **"What is `@DataProvider` in TestNG and equivalent in Playwright?"**  
   `@DataProvider` returns a 2D array of test data; `@Test(dataProvider="name")` runs once per row. Playwright equivalent: loop `for (const row of data) { test(row.name, …) }` or `test.describe.parallel()` with test.each.
