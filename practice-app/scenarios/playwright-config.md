# Playwright Config — Practice Scenarios

**App URL:** `http://localhost:3000/playwright-config/index.html`

---

## Config Quick Reference (from the app)

| Config Key | Default / Recommended | What it does |
|---|---|---|
| `timeout` | `30_000` | Max ms per test. Override with `test.setTimeout()` |
| `retries` | `2` (CI), `0` (local) | Auto-retry on failure |
| `workers` | `'50%'` | Parallel threads. Use `fullyParallel: true` |
| `screenshot` | `'only-on-failure'` | `'on'` \| `'off'` \| `'only-on-failure'` |
| `video` | `'retain-on-failure'` | `'on'` \| `'off'` \| `'on-first-retry'` |
| `trace` | `'retain-on-failure'` | `'on'` \| `'off'` \| `'on-first-retry'` |
| `baseURL` | `'http://localhost:3000'` | Enables `page.goto('/path')` |
| `viewport` | `{ width:1280, height:720 }` | Default browser window size |
| `reporter` | `[['html'],['list']]` | html · list · json · dot · junit |

---

## Scenario 1 — `timeout` & `expect.timeout`: Validate Slow Inventory Load

**Level:** Beginner  
**Configs:** `timeout` · `expect: { timeout }` · `test.slow()` · `navigationTimeout`  
**Section:** 1. Timeout Scenarios

### Context
The Inventory panel simulates a 5-second API call. A test with the default 30s test timeout
will pass, but `expect.timeout` (default 5s) will fail unless configured correctly.
This scenario practices adjusting timeouts at config, test, and assertion levels.

### playwright.config.js setup
```js
export default defineConfig({
  timeout: 30_000,          // per-test timeout
  expect: { timeout: 8000 }, // assertion-level timeout (default 5000)
  use: {
    navigationTimeout: 10_000,
    baseURL: 'http://localhost:3000',
  },
});
```

### Steps
1. Navigate to `http://localhost:3000/playwright-config/index.html`
2. At the top of the test call `test.slow()` (triples timeout: 30s → 90s)
3. Assert `[data-testid="inventory-result"]` is NOT visible (initial state)
4. Assert `[data-testid="inventory-loading"]` has `aria-busy="false"`
5. Click **"Fetch Inventory"** (`[data-testid="btn-load-inventory"]`)
6. Assert `[data-testid="inventory-loading"]` has `aria-busy="true"` — loading started
7. Assert `[data-testid="inventory-status"]` has `aria-busy="true"`
8. Wait for `[data-testid="inventory-result"]` to become visible (web-first assertion waits automatically)
9. Assert `[data-testid="inv-item-0"]` is visible and has `data-sku="SKU-001"`
10. Assert `[data-testid="inv-item-2"]` has `data-stock="out"`
11. Assert `[data-testid="inv-stock-1"]` has text `"12"` (low stock item)
12. Assert `[data-testid="inventory-status"]` contains `"loaded"`

### Expected Result
- Loading skeleton appears immediately on button click (`aria-busy="true"`)
- After ~5s the inventory list renders with 3 items
- Low stock item (SKU-002) shows orange indicator
- Out-of-stock item (SKU-003) shows red indicator

### Playwright Code Hint
```js
import { test, expect } from '@playwright/test';

test('inventory slow load with timeout config', async ({ page }) => {
  test.slow(); // triples timeout — required for 5s API call

  await page.goto('/playwright-config/index.html');

  await expect(page.locator('[data-testid="inventory-result"]')).toBeHidden();
  await expect(page.locator('[data-testid="inventory-loading"]')).toHaveAttribute('aria-busy', 'false');

  await page.click('[data-testid="btn-load-inventory"]');
  await expect(page.locator('[data-testid="inventory-loading"]')).toHaveAttribute('aria-busy', 'true');

  // Web-first assertion waits up to expect.timeout (configured to 8000ms)
  await expect(page.locator('[data-testid="inventory-result"]')).toBeVisible();
  await expect(page.locator('[data-testid="inv-item-0"]')).toHaveAttribute('data-sku', 'SKU-001');
  await expect(page.locator('[data-testid="inv-item-2"]')).toHaveAttribute('data-stock', 'out');
  await expect(page.locator('[data-testid="inv-stock-1"]')).toHaveText('12');
});
```

### Timeout Override Levels (important interview concept)
```js
// 1. Config level (applies to all tests)
defineConfig({ timeout: 30_000, expect: { timeout: 5_000 } })

// 2. Test level
test('my test', async ({ page }) => {
  test.setTimeout(60_000); // override for this test only
  test.slow();              // OR: multiply config timeout by 3
});

// 3. Assertion level
await expect(locator).toBeVisible({ timeout: 10_000 });

// 4. Action level  
await page.click('#btn', { timeout: 5_000 });
```

### Locator Practice
- Button by `id`: `#btn-load-inventory`
- Button by `aria-label`: `getByRole('button', { name: 'Fetch inventory data' })`
- Skeleton by `aria-busy`: `[data-testid="inventory-loading"][aria-busy="true"]`
- Inventory item by `data-sku` (dynamic): `[data-sku="SKU-002"]`
- Stock value by `data-testid` + nth: `locator('[data-testid^="inv-item-"]').nth(1)`
- Status by `role`: `getByRole('status', { name: /Inventory/ })`

---

## Scenario 2 — `retries` & Flaky Test: Unstable API with Retry Strategy

**Level:** Intermediate  
**Configs:** `retries: 2` · `test.info().retry` · `test.fixme()` · `test.fail()`  
**Section:** 2. Retries & Flaky Behaviour

### Context
The "Unstable API" button simulates a real-world flaky endpoint — it fails ~70% of the time
on the first call. With `retries: 2`, Playwright reruns the test automatically.
This scenario teaches how to handle flaky tests and use retry info in test logic.

### playwright.config.js setup
```js
export default defineConfig({
  retries: process.env.CI ? 2 : 0, // retries only in CI is best practice
  use: { baseURL: 'http://localhost:3000' },
});
```

### Steps — Part A: Basic Retry Test
1. Navigate to `http://localhost:3000/playwright-config/index.html`
2. Click **"Call Unstable API"** (`[data-testid="btn-unstable-api"]`)
3. Assert `[data-testid="api-result"]` is visible
4. Assert `[data-testid="api-result"]` has `data-status="success"` (may need retries)
5. Assert `[data-testid="api-result"]` contains text `"200 OK"`
6. Assert `[data-testid="total-success"]` shows `"1"`

### Steps — Part B: Use `test.info().retry` to change behavior per attempt
1. Navigate to `http://localhost:3000/playwright-config/index.html`
2. Check `test.info().retry` — if this is attempt 0, expect possible failure
3. If `test.info().retry > 0` click "Reset" first (`[data-testid="btn-reset-flaky"]`) to clear state
4. Click **"Call Unstable API"** (`[data-testid="btn-unstable-api"]`)
5. Assert `[data-testid="api-result"]` has `data-status="success"`

### Steps — Part C: `test.fixme()` — mark known-flaky
1. Wrap test body with `test.fixme(test.info().retry < 1, 'Known flaky — skip first attempt')`

### Expected Result
- First attempt often fails (70% chance) — `api-result` shows red 503 error
- With `retries: 2`, Playwright retries → second/third attempt likely succeeds
- Attempt log shows failed attempts then a success entry
- Total calls counter increments on each attempt

### Playwright Code Hint
```js
import { test, expect } from '@playwright/test';

test('unstable API with retry strategy', async ({ page }, testInfo) => {
  await page.goto('/playwright-config/index.html');

  // On a retry, reset state so previous failed clicks don't pollute
  if (testInfo.retry > 0) {
    await page.click('[data-testid="btn-reset-flaky"]');
  }

  await page.click('[data-testid="btn-unstable-api"]');

  // Web-first — retries assertion until timeout
  await expect(page.locator('[data-testid="api-result"]')).toBeVisible();
  await expect(page.locator('[data-testid="api-result"]')).toHaveAttribute('data-status', 'success');
  await expect(page.locator('[data-testid="api-result"]')).toContainText('200 OK');
});

// Mark as known-flaky
test('flaky payment gateway — known issue', async ({ page }, testInfo) => {
  test.fixme(testInfo.retry === 0, 'Gateway intermittently unavailable on first load');
  await page.goto('/playwright-config/index.html');
  await expect(page.locator('[data-testid="payment-gateway"]')).toBeVisible();
  await expect(page.locator('[data-testid="gateway-status"]')).toHaveText('available');
});
```

### Key Concepts for Interview
```js
// retries in config
retries: process.env.CI ? 2 : 0  // CI gets retries, local doesn't (fast feedback)

// Access retry number inside test
test('...', async ({ page }, testInfo) => {
  console.log(`Attempt: ${testInfo.retry}`);    // 0 = first run
  console.log(`Retries allowed: ${testInfo.project.retries}`);
});

// test.fail() — assert that test IS expected to fail
test.fail(); // marks test as "expected failure" — passes if it fails, fails if it passes

// test.fixme() — skip on condition
test.fixme(condition, 'reason');
```

### Locator Practice
- API result by `data-status` (dynamic): `[data-testid="api-result"][data-status="success"]`
- API result by `data-status` failure: `[data-testid="api-result"][data-status="failure"]`
- Attempt log items by role: `getByRole('list', { name: 'API call attempt log' }).locator('li')`
- Counter by `data-testid`: `[data-testid="total-calls"]`
- Gateway by `aria-label`: `getByRole('region', { name: 'Payment gateway' })`
- Gateway link: `getByRole('link', { name: 'Connect now' })`

---

## Scenario 3 — `screenshot`, `video`, `trace`: Multi-step Checkout Failure Capture

**Level:** Advanced  
**Configs:** `screenshot: 'only-on-failure'` · `video: 'retain-on-failure'` · `trace: 'retain-on-failure'` · `outputDir`  
**Section:** 3 (Screenshots) + 4 (Checkout/Video/Trace)

### Context
The checkout flow is a 3-step process: Cart → Shipping → Payment. When a test fails
mid-flow (e.g., invalid card), Playwright captures a screenshot, video, and trace of the
failure state. This scenario practices the full config setup for visual debugging artifacts.

### playwright.config.js setup
```js
export default defineConfig({
  outputDir: 'test-results',
  use: {
    baseURL:    'http://localhost:3000',
    screenshot: 'only-on-failure',   // saved to test-results/ on failure
    video:      'retain-on-failure', // video saved only when test fails
    trace:      'retain-on-failure', // trace zip saved only when test fails
    viewport:   { width: 1280, height: 720 },
  },
});
```

### Steps — Part A: Happy Path (full checkout)
1. Navigate to `http://localhost:3000/playwright-config/index.html`
2. Assert `[data-testid="step-node-1"]` has class `active`
3. Assert `[data-testid="step-panel-cart"]` is visible
4. Assert `[data-testid="cart-body"]` contains 2 rows
5. Assert `[data-testid="cart-total"]` contains `"$1,417.00"`
6. Click **"Continue to Shipping"** (`[data-testid="btn-to-shipping"]`)
7. Assert `[data-testid="step-panel-shipping"]` is visible
8. Assert `[data-testid="step-node-1"]` now has class `done`
9. Fill `[data-testid="ship-name"]` with `"Test Automation"`
10. Fill `[data-testid="ship-address"]` with `"123 QA Street"`
11. Fill `[data-testid="ship-city"]` with `"Mumbai"`
12. Fill `[data-testid="ship-pin"]` with `"400001"`
13. Select `"express"` in `[data-testid="ship-method"]`
14. Click **"Continue to Payment"** (`[data-testid="btn-to-payment"]`)
15. Assert `[data-testid="step-panel-payment"]` is visible
16. Assert `[data-testid="summary-shipping"]` contains `"$5.99"`
17. Fill `[data-testid="pay-card"]` with `"4111111111111111"`
18. Fill `[data-testid="pay-expiry"]` with `"12/27"`
19. Fill `[data-testid="pay-cvv"]` with `"123"`
20. Click **"Place Order"** (`[data-testid="btn-place-order"]`)
21. Assert `[data-testid="order-confirmation"]` is visible
22. Assert `[data-testid="order-id"]` matches `/ORD-\d{5}/`

### Steps — Part B: Failure Path (bad card — triggers screenshot + video + trace)
1. Navigate to `http://localhost:3000/playwright-config/index.html`
2. Complete steps 6–16 from Part A (cart → shipping → payment step)
3. Fill `[data-testid="pay-card"]` with `"1234"` (invalid — too short)
4. Click **"Place Order"** (`[data-testid="btn-place-order"]`)
5. Assert `[data-testid="pay-card-error"]` is visible (validation error)
6. **Intentionally fail** the test: assert `[data-testid="order-confirmation"]` is visible  
   ← This assertion will FAIL, triggering screenshot + video + trace capture

### Steps — Part C: Screenshot states practice
1. Navigate to `http://localhost:3000/playwright-config/index.html`
2. Click **"Success"** banner button (`[data-testid="btn-show-success"]`)
3. Assert `[data-testid="banner-success"]` is visible
4. Take manual screenshot: `await page.screenshot({ path: 'screenshots/success-state.png' })`
5. Click **"Error"** banner button (`[data-testid="btn-show-error"]`)
6. Assert `[data-testid="banner-error"]` is visible
7. Assert `[data-testid="banner-success"]` is NOT visible
8. Take screenshot: `await page.screenshot({ path: 'screenshots/error-state.png' })`
9. Click **"Delete Record"** (`[data-testid="btn-open-modal"]`)
10. Assert `[data-testid="modal-overlay"]` is visible
11. Assert `[data-testid="modal-title"]` has text `"Confirm Deletion"`
12. Take screenshot of modal overlay state
13. Click **"Cancel"** (`[data-testid="btn-modal-cancel"]`) → assert modal closes
14. Click **"Delete Record"** → click **"Delete"** (`[data-testid="btn-modal-confirm"]`)
15. Assert success banner appears with text `"deleted successfully"`

### Expected Result
- Happy path: order placed with `ORD-XXXXX` confirmation
- Failure path: `pay-card-error` shows, confirmation hidden → Playwright saves screenshot, video, trace to `test-results/`
- Trace viewable with: `npx playwright show-trace test-results/<test-name>/trace.zip`

### Playwright Code Hint
```js
import { test, expect } from '@playwright/test';

test('checkout happy path — traces captured on failure', async ({ page }) => {
  await page.goto('/playwright-config/index.html');

  // Step 1: Cart
  await expect(page.locator('[data-testid="step-node-1"]')).toHaveClass(/active/);
  await expect(page.locator('[data-testid="cart-total"]')).toContainText('$1,417.00');
  await page.click('[data-testid="btn-to-shipping"]');

  // Step 2: Shipping
  await expect(page.locator('[data-testid="step-panel-shipping"]')).toBeVisible();
  await page.fill('[data-testid="ship-name"]',    'Test Automation');
  await page.fill('[data-testid="ship-address"]', '123 QA Street');
  await page.fill('[data-testid="ship-city"]',    'Mumbai');
  await page.fill('[data-testid="ship-pin"]',     '400001');
  await page.selectOption('[data-testid="ship-method"]', 'express');
  await page.click('[data-testid="btn-to-payment"]');

  // Step 3: Payment
  await expect(page.locator('[data-testid="step-panel-payment"]')).toBeVisible();
  await expect(page.locator('[data-testid="summary-shipping"]')).toContainText('$5.99');
  await page.fill('[data-testid="pay-card"]',   '4111111111111111');
  await page.fill('[data-testid="pay-expiry"]', '12/27');
  await page.fill('[data-testid="pay-cvv"]',    '123');
  await page.click('[data-testid="btn-place-order"]');

  // Confirmation
  await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
  await expect(page.locator('[data-testid="order-id"]')).toHaveText(/ORD-\d{5}/);
});

test('manual screenshot capture', async ({ page }) => {
  await page.goto('/playwright-config/index.html');
  await page.click('[data-testid="btn-show-error"]');
  await expect(page.locator('[data-testid="banner-error"]')).toBeVisible();
  await page.screenshot({ path: 'screenshots/error-banner.png', fullPage: false });

  // Visual regression (needs baseline)
  // await expect(page).toHaveScreenshot('error-banner.png');
});
```

### Screenshot / Video / Trace Config Reference
```js
// playwright.config.js
use: {
  // Screenshot
  screenshot: 'only-on-failure', // 'on' | 'off' | 'only-on-failure'

  // Video
  video: 'retain-on-failure',    // 'on' | 'off' | 'on-first-retry' | 'retain-on-failure'

  // Trace (opens in trace viewer: npx playwright show-trace trace.zip)
  trace: 'retain-on-failure',    // 'on' | 'off' | 'on-first-retry' | 'retain-on-failure'
}

// Manual screenshot in test
await page.screenshot({ path: 'my-screenshot.png', fullPage: true });
await page.locator('[data-testid="modal-box"]').screenshot({ path: 'modal.png' });

// Visual regression testing (baseline approach)
await expect(page).toHaveScreenshot('baseline.png', { threshold: 0.1 });
await expect(page.locator('[data-testid="banner-error"]')).toHaveScreenshot();

// View trace
// npx playwright show-trace test-results/test-name/trace.zip
```

### Locator Practice
- Stepper node active: `[data-testid="step-node-1"].active` or `locator('[data-testid="step-node-1"]').filter({ hasClass: /active/ })`
- Cart row count: `locator('[data-testid^="cart-row-"]').count()` → `toBe(2)`
- Shipping method option: `getByRole('option', { name: /Express/ })`
- Modal overlay: `getByRole('dialog', { name: 'Confirm Deletion' })`
- Modal title: `getByRole('heading', { name: 'Confirm Deletion' })`
- Order ID pattern: `getByTestId('order-id').toHaveText(/ORD-\d{5}/)`
- Card error: `getByRole('alert')` inside payment panel

---

## Bonus — `viewport` & `projects`: Responsive Testing

**Level:** Intermediate  
**Configs:** `viewport` · `projects` · `page.setViewportSize()`  
**Section:** 5. Viewport & Responsive

### Context
The product grid changes from 4-column (desktop) to 2-column (tablet) to 1-column (mobile).
The navigation swaps from a full nav bar to a hamburger menu below 600px.
Use `projects` in config to run the same tests across multiple viewports.

### playwright.config.js setup
```js
export default defineConfig({
  projects: [
    { name: 'Desktop Chrome',  use: { ...devices['Desktop Chrome'],  viewport: { width: 1280, height: 720 }  } },
    { name: 'Tablet Safari',   use: { ...devices['iPad (gen 7)'],     viewport: { width: 768,  height: 1024 } } },
    { name: 'Mobile Chrome',   use: { ...devices['Pixel 5'],          viewport: { width: 393,  height: 851 }  } },
  ],
});
```

### Steps
1. Navigate to `http://localhost:3000/playwright-config/index.html`
2. Assert `[data-testid="viewport-display"]` shows current width × height
3. Assert `[data-testid="breakpoint-label"]` shows correct breakpoint (`Desktop` / `Tablet` / `Mobile`)
4. On **Desktop** (≥769px): assert `[data-testid="nav-desktop"]` is visible, `[data-testid="nav-mobile"]` is hidden
5. On **Mobile** (≤600px): assert `[data-testid="nav-mobile"]` is visible, `[data-testid="nav-desktop"]` is hidden
6. On Mobile: click hamburger `[data-testid="btn-hamburger"]`
7. Assert `[data-testid="mobile-menu"]` is visible
8. Assert `[data-testid="btn-hamburger"]` has `aria-expanded="true"`
9. Assert `[data-testid="product-grid"]` contains 4 product cards

### Playwright Code Hint
```js
import { test, expect } from '@playwright/test';

test('responsive nav — desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/playwright-config/index.html');
  await expect(page.locator('[data-testid="nav-desktop"]')).toBeVisible();
  await expect(page.locator('[data-testid="nav-mobile"]')).toBeHidden();
  await expect(page.locator('[data-testid="breakpoint-label"]')).toHaveText('Desktop');
});

test('responsive nav — mobile hamburger', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/playwright-config/index.html');
  await expect(page.locator('[data-testid="nav-mobile"]')).toBeVisible();
  await page.click('[data-testid="btn-hamburger"]');
  await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  await expect(page.locator('[data-testid="btn-hamburger"]')).toHaveAttribute('aria-expanded', 'true');
});

test('product grid count', async ({ page }) => {
  await page.goto('/playwright-config/index.html');
  await expect(page.locator('[data-testid^="product-card-"]')).toHaveCount(4);
});
```

### Locator Practice
- Viewport info: `[data-testid="viewport-display"]`
- Breakpoint badge: `getByRole('status').filter({ hasText: /Desktop|Tablet|Mobile/ })`
- Nav desktop: `[data-testid="nav-desktop"]` — visible only on wide screens
- Hamburger: `getByRole('button', { name: 'Open mobile menu' })`
- Mobile menu open: `[data-testid="mobile-menu"].open`
- Product card by `data-product` attribute: `[data-product="laptop"]`
- Product name: `getByTestId('product-name-0')`

---

## Common Interview Questions Covered

| Question | Config/Concept | App Section |
|---|---|---|
| How do you set per-test timeout? | `test.setTimeout()` / `test.slow()` | Section 1 |
| Difference between `timeout` and `expect.timeout`? | config vs assertion level | Section 1 |
| How do retries work in Playwright? | `retries: 2`, `test.info().retry` | Section 2 |
| How to mark a test as known-flaky? | `test.fixme()` / `test.fail()` | Section 2 |
| When is screenshot captured? | `screenshot: 'only-on-failure'` | Section 3 |
| How to capture trace for debugging? | `trace: 'retain-on-failure'` | Section 4 |
| How to view a trace file? | `npx playwright show-trace` | Section 4 |
| How to run tests on multiple browsers? | `projects` config | Section 5 |
| How to test responsive layouts? | `viewport` / `setViewportSize()` | Section 5 |
| What does `baseURL` do? | Enables relative `page.goto()` | Section 6 |
