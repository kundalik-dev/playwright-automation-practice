# Hooks Practice Scenarios

Practice app URL: `http://localhost:3000/hooks/index.html`

---

## Hook Execution Order Reference

| Hook | Playwright | Selenium (TestNG) | When it runs |
|---|---|---|---|
| Before all tests | `test.beforeAll` | `@BeforeClass` | Once — before the first test in a describe |
| Before each test | `test.beforeEach` | `@BeforeMethod` | Before every individual test |
| After each test | `test.afterEach` | `@AfterMethod` | After every individual test |
| After all tests | `test.afterAll` | `@AfterClass` | Once — after the last test in a describe |

**Key rule:** `beforeAll` / `afterAll` share one browser context. `beforeEach` / `afterEach` wrap every single test and reset state between them.

---

## Scenario 1 — E-Commerce: Login → Cart → Logout

### Context
You are testing the shopping cart. Login is expensive (DB call), so you log in **once** with `beforeAll` and log out **once** with `afterAll`. Between tests you clear the cart state with `beforeEach`.

### Hook Strategy
```
describe('Shopping Cart')
  beforeAll  → login as standard_user / password123
  beforeEach → clear cart (click "Clear Cart")
  afterEach  → assert cart count is 0 (state is clean)
  afterAll   → click Logout button
```

---

### Test 1.1 — Add single item to cart

**Steps**
1. (beforeAll already ran → user is logged in, products visible)
2. (beforeEach already ran → cart count = 0)
3. Locate the Backpack product card: `[data-testid="product-backpack"]`
4. Click **Add to Cart**: `[aria-label="Add Sauce Labs Backpack to cart"]` OR `#add-to-cart-backpack`
5. Assert cart badge shows `1`: `[data-testid="cart-count"]`
6. Assert cart text contains "Sauce Labs Backpack": `[data-testid="cart-items-text"]`

**Expected Result**
- Cart badge = `1`
- Cart text = `Sauce Labs Backpack`
- Checkout button is enabled: `#checkout-btn` not disabled

---

### Test 1.2 — Add multiple items to cart

**Steps**
1. (beforeEach → cart cleared, count = 0)
2. Click "Add to Cart" for Backpack: `#add-to-cart-backpack`
3. Click "Add to Cart" for T-Shirt: `#add-to-cart-tshirt`
4. Click "Add to Cart" for Onesie (no stable ID — use aria-label): `[aria-label="Add Sauce Labs Onesie to cart"]`
5. Assert cart count = `3`: `[data-testid="cart-count"]`

**Expected Result**
- Cart badge = `3`
- All three product names appear in cart text

**Locator variants to try**
```js
// by id
page.locator('#add-to-cart-backpack')

// by aria-label
page.getByRole('button', { name: 'Add Sauce Labs T-Shirt to cart' })

// by data-testid
page.locator('[data-testid="add-to-cart-tshirt"]')

// nth-child (no stable locator — positional)
page.locator('.product-card').nth(2).getByRole('button', { name: 'Add to Cart' })
```

---

### Test 1.3 — Checkout clears the cart

**Steps**
1. (beforeEach → cart cleared)
2. Add Backpack to cart
3. Click **Checkout**: `#checkout-btn` OR `[data-testid="checkout-btn"]`
4. Assert order confirmation appears: `[data-testid="checkout-result"]` is visible
5. Assert cart count resets to `0`: `[data-testid="cart-count"]`

**Expected Result**
- Checkout result box is visible and contains text starting with "Order placed!"
- Cart badge = `0`

---

### afterAll — Logout

**Steps**
1. Click Logout: `[data-testid="logout-btn"]` OR `#logout-btn`
2. Assert session status shows "Not logged in": `[data-testid="session-status"]`
3. Assert login panel is visible again: `[data-testid="login-panel"]`
4. Assert products panel is hidden: `[data-testid="products-panel"]`

---

## Scenario 2 — Registration Form: Validation

### Context
Each test fills the form with different data and checks the validation state. `beforeEach` resets the form so each test starts with a clean slate. `afterEach` verifies no stale messages remain from the previous test.

### Hook Strategy
```
describe('Registration Form Validation')
  beforeEach → click "Reset Form" (#reset-form-btn) to clear all fields and errors
  afterEach  → assert success and error boxes are hidden (no bleed between tests)
```

---

### Test 2.1 — Submit with all empty fields

**Steps**
1. (beforeEach → form reset)
2. Click **Create Account**: `[data-testid="create-account-btn"]` OR `getByRole('button', { name: 'Create Account' })`
3. Assert field error for Full Name is visible: `[data-testid="err-full-name"]`
4. Assert field error for Email is visible: `[data-testid="err-email"]`
5. Assert field error for Password is visible: `[data-testid="err-password"]`
6. Assert field error for Terms is visible: `[data-testid="err-terms"]`
7. Assert global error box is visible: `[data-testid="form-error"]`
8. Assert success box is NOT visible: `[data-testid="form-success"]`

**Locator variants to try**
```js
// by id
page.locator('#full-name')

// by label text (Playwright)
page.getByLabel('Full name')

// by placeholder
page.getByPlaceholder('john@example.com')

// by name attribute
page.locator('[name="email"]')

// by input type
page.locator('[type="password"]')
```

---

### Test 2.2 — Submit with valid data

**Steps**
1. (beforeEach → form reset)
2. Fill Full Name: `page.getByLabel('Full name')` → `John Doe`
3. Fill Email: `[name="email"]` → `john@example.com`
4. Fill Phone: `page.getByPlaceholder('Enter phone number')` → `9876543210`
5. Fill Password: `[data-testid="input-password"]` → `Secure@123`
6. Select Role: `#role-select` → `developer`
7. Check Terms: `#terms-checkbox` OR `[data-testid="terms-checkbox"]`
8. Click **Create Account**
9. Assert success message is visible: `[data-testid="form-success"]`
10. Assert success message contains "John Doe"

**Expected Result**
- Success box visible, contains `Account created for John Doe`
- No field-level error messages are visible

---

### Test 2.3 — Invalid email format

**Steps**
1. (beforeEach → form reset)
2. Fill Full Name: `John Doe`
3. Fill Email with invalid value: `notanemail`
4. Fill Password: `password123`
5. Check Terms checkbox
6. Click **Create Account**
7. Assert email error is visible: `[data-testid="err-email"]`
8. Assert success box is hidden: `[data-testid="form-success"]`

---

### Test 2.4 — Password too short

**Steps**
1. (beforeEach → form reset)
2. Fill Full Name and valid Email
3. Fill Password: `abc` (less than 8 characters)
4. Check Terms
5. Click **Create Account**
6. Assert password error is visible: `[data-testid="err-password"]`

---

## Scenario 3 — Admin User Table (CRUD)

### Context
Admin table tests need known data. `beforeAll` seeds 3 users so every test starts with a predictable state. `afterAll` clears all data. `beforeEach` asserts the starting row count so any data leak between tests is caught early.

### Hook Strategy
```
describe('Admin User Table')
  beforeAll  → click "Seed Users" → assert user-count = 3
  beforeEach → assert [data-testid="user-count"] = expected count (3 initially)
  afterEach  → log current user count to test report
  afterAll   → click "Reset Data" → assert user-count = 0
```

---

### Test 3.1 — Verify seeded users are displayed

**Steps**
1. (beforeAll → 3 users seeded)
2. Assert table has 3 data rows: `[data-testid="users-tbody"] tr` count = 3
3. Assert Alice Johnson exists: `[data-testid="user-name-1"]` has text `Alice Johnson`
4. Assert Bob Smith email: `[data-testid="user-email-2"]` has text `bob@example.com`
5. Assert row by aria-rowindex: `[aria-rowindex="2"]` (Alice's row)

**Locator variants to try**
```js
// by data-testid
page.locator('[data-testid="user-row-1"]')

// by role (advanced)
page.getByRole('row', { name: /Alice Johnson/ })

// by aria-rowindex (advanced)
page.locator('[aria-rowindex="3"]')

// positional (nth)
page.locator('#users-tbody tr').nth(0)

// by data attribute
page.locator('[data-user-id="2"]')
```

---

### Test 3.2 — Delete a user

**Steps**
1. (beforeEach → assert count = 3)
2. Click delete button for Bob Smith: `[aria-label="Delete Bob Smith"]` OR `[data-testid="delete-user-2"]`
3. Assert user-count = `2`: `[data-testid="user-count"]`
4. Assert Bob Smith row is gone: `[data-testid="user-row-2"]` is not visible
5. Assert action result shows "Deleted user: Bob Smith": `[data-testid="table-action-result"]`

---

### Test 3.3 — Add a new user

**Steps**
1. (beforeEach → assert count = 3)
2. Click **+ Add User**: `[data-testid="add-user-btn"]` OR `[aria-label="Add new user"]`
3. Assert user-count = `4`: `[data-testid="user-count"]`
4. Assert last row in table exists: `page.locator('#users-tbody tr').last()`
5. Assert action result contains "Added user": `[data-testid="table-action-result"]`

---

### afterAll — Reset Data

**Steps**
1. Click **Reset Data**: `[data-testid="clear-data-btn"]` OR `[aria-label="Clear all user data"]`
2. Assert user-count = `0`: `[data-testid="user-count"]`
3. Assert "no-data-row" is visible: `[data-testid="no-data-row"]`
4. Assert action result contains "afterAll cleanup": `[data-testid="table-action-result"]`

---

## Playwright Snippet Templates

### Basic hook structure
```js
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {

  test.beforeAll(async ({ browser }) => {
    // runs once — create a shared context/page here
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/hooks/index.html');
    // reset state
  });

  test('scenario name', async ({ page }) => {
    // your test actions and assertions
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test.afterAll(async () => {
    // cleanup — runs once after all tests complete
  });

});
```

### Sharing page across tests with beforeAll
```js
test.describe('Shared Session', () => {
  let sharedPage;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    sharedPage = await context.newPage();
    await sharedPage.goto('http://localhost:3000/hooks/index.html');
    await sharedPage.fill('#login-username', 'standard_user');
    await sharedPage.fill('#login-password', 'password123');
    await sharedPage.click('#login-btn');
    await expect(sharedPage.locator('[data-testid="session-status"]'))
      .toContainText('standard_user');
  });

  test.afterAll(async () => {
    await sharedPage.click('[data-testid="logout-btn"]');
    await sharedPage.close();
  });

  test('add item to cart', async () => {
    await sharedPage.click('[data-testid="clear-cart-btn"]');
    await sharedPage.click('#add-to-cart-backpack');
    await expect(sharedPage.locator('[data-testid="cart-count"]')).toHaveText('1');
  });
});
```

---

## Interview Checkpoints

| Question | Answer |
|---|---|
| When does `beforeAll` run in a nested `describe`? | Once per `describe` block it belongs to, not once per the whole file |
| Can `beforeAll` use the `page` fixture directly? | No — `page` is per-test. Use `browser` or `browserContext` fixture instead |
| What happens if `beforeEach` throws? | The test is skipped/fails; `afterEach` still runs |
| `beforeAll` vs `beforeEach` — which for login? | `beforeAll` if login is expensive; `beforeEach` if each test needs a clean session |
| How to take a screenshot only on test failure? | In `afterEach`, check `testInfo.status !== testInfo.expectedStatus` |
| Execution order with nested `describe`? | Outer `beforeAll` → Outer `beforeEach` → Inner `beforeEach` → test → Inner `afterEach` → Outer `afterEach` → (repeat) → Outer `afterAll` |
