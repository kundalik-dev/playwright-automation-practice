# 🎭 Annotations & Tags in Playwright

Annotations and tags are provided in test so that we can filter test cases while running.

## Annotations

- Describe ✅
- Tags ✅
- Skip ✅
- Only ✅
- Slow ✅
- Info
- Fail
- Failme
- Step
- beforeAll
- afterAll
- beforeEach
- afterEach

## ✒️ Short Notes

| Annotation   | Short Description                                                                  |
| ------------ | ---------------------------------------------------------------------------------- |
| `describe`   | Groups related tests into a block; scopes hooks and modifiers to that group.       |
| `tag`        | Labels tests (e.g. `@sanity`, `@reg`) to filter runs via `--grep`.                 |
| `skip`       | Skips the test entirely; doesn't execute it.                                       |
| `only`       | Runs only this test/group, skipping all others in the run.                         |
| `slow`       | Triples the timeout for a test, group, or file.                                    |
| `info`       | Attaches custom metadata/annotations to the test result at runtime.                |
| `fail`       | Marks the test as expected to fail; reports differently if it unexpectedly passes. |
| `fixme`      | Marks a test as broken/to-be-fixed; Playwright stops execution at that call.       |
| `step`       | Breaks a test into named, nested sub-steps for clearer reports and debugging.      |
| `beforeAll`  | Runs once before all tests in the file/describe block.                             |
| `afterAll`   | Runs once after all tests in the file/describe block.                              |
| `beforeEach` | Runs before every individual test in the file/describe block.                      |
| `afterEach`  | Runs after every individual test in the file/describe block.                       |

## 1️⃣ Describe

- Logical Container: Used to group related tests (by feature, page, or user flow) into a single block.
- Scoping Mechanism: Creates a local boundary for hooks, modifiers, and execution settings.

## 🚀 Key Capabilities to Remember

- **Scoped Hooks:** `test.beforeEach` and `test.afterEach` declared inside a block only execute for tests within that specific block.
- **Mass Modifiers:** Applying annotations like `test.slow()`, `test.skip()`, or `test.only()` at the describe level automatically affects every test inside it.
- **Hierarchical Nesting:** Can be nested inside other describe blocks to create granular, highly structured test suites.
- **Clean Reporting:** Groups tests visually in HTML and terminal test reports for much easier debugging.

## ⚙️ Execution Modes

- `test.describe.parallel()`:
  - Forces all tests inside the block to run concurrently across multiple workers to save execution time.
- `test.describe.serial()`:
  - Runs tests sequentially.
  - **Crucial rule:** If one test fails, all remaining tests in that specific block are skipped instantly.

## 🛠️ Syntax Cheat Sheet

```js
// 1. Standard Grouping
test.describe('Authentication', () => { ... });
// 2. Execution Modifiers
test.describe.parallel('Dashboard Load Tests', () => { ... });
// 3. Advanced Configuration (Adding Metadata/Tags)
test.describe('Billing System', { tag: '@smoke' }, () => { ... });

// 4. Basic syntax
test.describe.paralle("group description txt @sanity", ()=>{
  test("",async({page})=>{

  })
})
```

## 2️⃣ Taging test cases

- Tags are provided after test cases name using `@ attribute` (Legacy Way)
- Multiple tags can be provided for single test cases like `@reg` `@sanity` with sapce between
- Using CLI we can run taged test cases using `--grep="@sanity`
- In latest playwright tags provided as arrays after test case name

### New Way

```js
test("Test1", { tag: ["@sanity", "@reg"] }, async ({ page }) => {
  console.log("Running Test 1");
});
```

### Old Way

```js
test("Test1 @sanity @reg", async ({ page }) => {
  console.log("Running Test 1");
});
```

> Both way works

### To Run only `sanity` tests

```js
npx playwright test --grep "@sanity"
```

### To Run only `sanity` OR `reg` tests using `OR` as `| pipe`

Sanity OR Regression

```js
npx playwright test --grep "@sanity|@reg"
```

### To Run only `sanity` and `reg` tests using `AND` with regex

Sanity AND Regression

```js
npx playwright test --grep "(?=.*@sanity)(?=.*@reg)"
```

### Run Sanity, but SKIP both Regression and Bugs

```js
npx playwright test --grep "@sanity" --grep-invert "@reg|@bug"
```

## Annotations with description

These are attached to report so we can know the extra details about issue. Details such as type and description is attached

```js
test(
  "Test1",
  {
    annotation: {
      type: "issue",
      description: "https://github.com/microsoft/playwright/issues/23180",
    },
    tag: ["@sanity", "@reg"],
  },
  async ({ page }) => {
    console.log("Running Test 1");
  },
);
```

👉 Annotations can be conditional based

```js
test("Test1", async ({ page, browserName }) => {
  if (browserName === "chromium") {
    test.skip();
  }
  console.log("Running Test 1");
});
```

## 3️⃣ Skip

- **Bypass Execution:** Prevents a test or group of tests from running entirely while keeping them in the codebase.
- **Maintain CI Greenness:** Prevents known, unfixed bugs from failing your deployment pipelines.
- **Reporting:** Marked as "skipped" status in the final test report without running any of its code.

## Purpose & Common Use Cases

1. **Handling Known Bugs:** If a feature is broken due to a known application bug, you can skip the test temporarily so it does not pollute your Continuous Integration (CI) pipeline with expected failures.
2. **Environment Filtering:** Certain tests might only work in specific environments (e.g., a test that requires a staging database should be skipped when running against production).
3. **Browser Limitations:** If a web feature is not supported by a specific browser engine (like a Chrome-only extension API), you can skip that test when running on WebKit or Firefox.
4. **WIP (Work In Progress):** Safely committing incomplete tests to the repository without breaking the main build.

## Execution Methods

### 1. Unconditional Skip (Always Skip)

Bypasses the test immediately in all environments.

```js
test("Broken checkout flow", async ({ page }) => {
  test.skip(); // Test stops here and is marked skipped
  await page.goto("/checkout");
});

test.skip("inline skip", async ({ page }) => {
  //skip test during execution
});
```

### 2. Conditional Skip (Best Practice)

Only skips the test if a specific condition evaluates to true. This allows you to provide a string description documenting why.

```js
test("Biometric login", async ({ page, browserName }) => {
  // Only skips on Firefox, runs normally on Chrome/Safari
  test.skip(
    browserName === "firefox",
    "Firefox does not support WebAuthn testing yet",
  );

  await page.goto("/login");
});
```

### 3. Scope-wide Skip

Placing it at the top of a file or inside a test.describe() block skips every single test within that boundary.

```js
test.describe("Beta Features", () => {
  test.skip(); // All tests inside this describe block will be skipped

  test("Beta tool A", async ({ page }) => {});
  test("Beta tool B", async ({ page }) => {});
});
```

## 4️⃣ Only

- **Focused Execution:** Isolates a specific test or group during local development.
- **Time Saver:** Prevents running hundreds of unrelated tests when you only need to debug one.
- **Local Use Only:** Strictly meant for local debugging. Never push `test.only()` to Git.
- **CI/CD Risk:** Committing it will break pipeline verification by skipping your actual regressions.
- **ES Lint:** Either use ES Lint to prevent with custome rules as `no-only-test` or `no-skipped-tests`

### Execution Scopes

You can apply the `.only` focus at three different structural levels:

#### 1. Single Test Isolation

Focuses exclusively on one individual test block.

```js
import { test, expect } from "@playwright/test";

test("Test A - Will be skipped", async ({ page }) => {});
// Playwright will ONLY run Test B
test.only("Test B - Active Debugging", async ({ page }) => {
  await page.goto("/dashboard");
});

test("Test C - Will be skipped", async ({ page }) => {});
```

#### 2. Group Isolation (test.describe.only)

Focuses on an entire block of related tests. Every test inside this specific describe container will run, while tests outside of it are ignored.

```js
import { test, expect } from "@playwright/test";
// Only the tests inside this specific group will execute
test.describe.only("Payment Gateway Tests", () => {
  test("Credit Card Checkout", async ({ page }) => {});
  test("PayPal Checkout", async ({ page }) => {});
});

test.describe("Profile Settings", () => {
  test("Update Avatar", async ({ page }) => {}); // Skipped
});
```

#### 3. Multiple Focus Targets

If you have multiple independent tests across different files that you are refactoring simultaneously, you can add .only to all of them. Playwright will run that specific subset.

```js
test.only("Fixing Bug #1", async ({ page }) => {});
test.only("Fixing Bug #2", async ({ page }) => {}); // Both execute; all other tests in the project are ignored.
```

## 5️⃣ Slow

- slow annotation slow down timeout the test executions timeout by `three times`
- provided in three different ways
  - `test.slow()` inside any test body to triple the timeout for that particular test case
  - `test.slow()` can be conditional inside test body
  - `test.slow()` for whole file group
- Used if some test cases need more time to process large data or calculations.
- In that cases instead increasing timeout for whole test cases we do it test cases basis or specific condition basis

```js
import { test, expect } from "@playwright/test";

// For entire file
test.slow();

test("Flaky or slow loading page on Safari", async ({ page, browserName }) => {
  // Approach 01 - Test body
  test.slow();

  // Approach 02 - Triples timeout ONLY when running on the WebKit (Safari) engine
  test.slow(
    browserName === "webkit",
    "WebKit engine requires extra time to render WebGL elements",
  );

  await page.goto("https://example.com");
});
```

### Slow with options

```js
test.slow();
test.slow(condition, description);
test.slow(callback, description);
```

## 6️⃣ Info

- Info annotaion used to add custom metadata to your tests dynamically
- while they are running.
- test information can be attach into report or used for other purposes in testing.
- Lost of information can be attached to report using `test.info(). `

```js
test("Checkout payment process", async ({ page }) => {
  test.info().annotations.push({
    type: "issue",
    description: "https://company.com",
  });

  test.info().annotations.push({
    type: "browser version",
    description: browser.version(),
  });

  // Test code...
});
```

### Step

- User can create multiple steps inside single test case
- Helps in dubugging, reports understanding
- Automatic Screenshot Grouping can be done
- Step nesting also supported.

```js
import { test, expect } from "@playwright/test";

test("End-to-End E-Commerce Purchase Flow", async ({ page }) => {
  await test.step("1. Log into user account", async () => {
    await page.goto("https://example-shop.com");
    await page.fill("#username", "test_user");
    await page.fill("#password", "password123");
    await page.click("#login-btn");
    await expect(page.locator("#welcome-msg")).toBeVisible();
  });

  await test.step("2. Add product to shopping cart", async () => {
    await page.goto("https://example-shop.com");
    await page.click("#add-to-cart-btn");
    await expect(page.locator(".cart-count")).hasText("1");
  });

  await test.step("3. Complete checkout and payment", async () => {
    await page.click("#checkout-btn");
    await page.fill("#credit-card", "4111222233334444");
    await page.click("#submit-payment");
    // Let's assume this assertion deliberately fails to see how it looks in reports:
    await expect(page.locator(".success-banner")).toBeVisible();
  });
});
```

## 7️⃣ Fail

Sometime test intentionally failed so we can fix them later.

## 8️⃣ Fixme

- Mark a test as "fixme", with the intention to fix it.
- Playwright will not run the test past the` test.fixme()` call.
- If your test should be fixed in some configurations, but not all, you can mark the test as "fixme" inside the test body based on some condition.

To declare a "fixme" test:

```js
test.fixme(title, body);
test.fixme(title, details, body);
```

To annotate test as "fixme" at runtime:

```js
test.fixme(condition, description);
test.fixme(callback, description);
test.fixme();
```

If your test should be fixed in some configurations, but not all, you can mark the test as "fixme" inside the test body based on some condition.

```js
import { test, expect } from "@playwright/test";

test("to be fixed in Safari", async ({ page, browserName }) => {
  test.fixme(
    browserName === "webkit",
    "This feature breaks in Safari for some reason",
  );
  // ...
});
```

You can mark all tests in a file or test.describe([title, details, callback]) group as "fixme" based on some condition with a single test.fixme(callback, description) call.

```js
import { test, expect } from "@playwright/test";

test.fixme(
  ({ browserName }) => browserName === "webkit",
  "Should figure out the issue",
);

test("to be fixed in Safari 1", async ({ page }) => {
  // ...
});
test("to be fixed in Safari 2", async ({ page }) => {
  // ...
});
```

You can also call test.fixme() without arguments inside the test body to always mark the test as failed. We recommend using test.fixme(title, body) instead.

```js
import { test, expect } from "@playwright/test";

test("less readable", async ({ page }) => {
  test.fixme();
  // ...
});
```

## 9️⃣ Step
