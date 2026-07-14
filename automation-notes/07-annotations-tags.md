# 🎭 Annotations & Tags in Playwright

Annotations and tags are provided in tests so that we can filter test cases while running.

## Annotations

- Describe ✅
- Tags ✅
- Skip ✅
- Only ✅
- Slow ✅
- Info ✅
- Fail ✅
- Fixme ✅
- Step ✅
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
test.describe.parallel("group description txt @sanity", () => {
  test("sample test", async ({ page }) => {

  })
})
```

## 2️⃣ Tagging test cases

- Tags are provided after the test case's name using `@ attribute` (Legacy Way)
- Multiple tags can be provided for a single test case, like `@reg` `@sanity`, with a space between
- Using the CLI we can run tagged test cases using `--grep "@sanity"`
- In the latest Playwright, tags are provided as an array after the test case name

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

> Both ways work

### To Run only `sanity` tests

```bash
npx playwright test --grep "@sanity"
```

### To Run only `sanity` OR `reg` tests using `OR` as `| pipe`

Sanity OR Regression

```bash
npx playwright test --grep "@sanity|@reg"
```

### To Run only `sanity` and `reg` tests using `AND` with regex

Sanity AND Regression

```bash
npx playwright test --grep "(?=.*@sanity)(?=.*@reg)"
```

### Run Sanity, but SKIP both Regression and Bugs

```bash
npx playwright test --grep "@sanity" --grep-invert "@reg|@bug"
```

### Annotations with description

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

### Purpose & Common Use Cases

1. **Handling Known Bugs:** If a feature is broken due to a known application bug, you can skip the test temporarily so it does not pollute your Continuous Integration (CI) pipeline with expected failures.
2. **Environment Filtering:** Certain tests might only work in specific environments (e.g., a test that requires a staging database should be skipped when running against production).
3. **Browser Limitations:** If a web feature is not supported by a specific browser engine (like a Chrome-only extension API), you can skip that test when running on WebKit or Firefox.
4. **WIP (Work In Progress):** Safely committing incomplete tests to the repository without breaking the main build.

### Execution Methods

#### 1. Unconditional Skip (Always Skip)

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

#### 2. Conditional Skip (Best Practice)

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

#### 3. Scope-wide Skip

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
- **ESLint:** Use ESLint with `eslint-plugin-playwright` to prevent this via rules such as `no-focused-test` or `no-skipped-test`

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

#### 2. Group Isolation `test.describe.only`

- Focuses on an entire block of related tests.
- Every test inside this specific describe container will run,
- while tests outside of it are ignored.

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

- `test.slow()` annotation slow down the test executions timeout by `three times`
- provided in three different ways
  - `test.slow()` inside any test body to triple the timeout for that particular test case
  - `test.slow()` can be conditional inside test body
  - `test.slow()` for whole file group
- Used if some test cases need more time to process large data or calculations.
- In that case, instead of increasing the timeout for all test cases, we do it on a per-test or per-condition basis

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

- `test.info()` annotation is used to `dynamically read metadata` or `push custom annotations` and `attachments` to the test runner at runtime.
- **Report Enrichment:** Dynamically injects notes, links, and debugging attachments straight into Playwright HTML Reports.
- Other annotations are hardcoded and static, but info is dynamic

### Detailed Breakdown

test.info() gives your code a programmatic handle to the current running test. Its two most powerful capabilities are creating Custom Annotations and logging Runtime Attachments.

#### 1. Runtime Custom Annotations

Instead of just using Playwright's built-in tags, we can push custom data directly into your HTML test report. This is highly useful for mapping tests to project management systems.

```js
test("Checkout payment process", async ({ page, browser }) => {
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

#### 2. Reading Test Metadata Contextually

We can read information about the `environment`, `test title`, `project configuration`, or `failure states` directly from inside the test loops or page object models.

```js
test("Dynamic Screenshot Naming", async ({ page }, testInfo) => {
  await page.goto("/dashboard");

  // Use testInfo properties to programmatically name an asset
  console.log(`Running: ${testInfo.title}`); // Prints the test name
  console.log(`Current Retry: ${testInfo.retry}`); // Useful for identifying flaky tests

  await page.screenshot({
    path: `screenshots/${testInfo.title}-retry-${testInfo.retry}.png`,
  });
});
```

#### 3. Custom Runtime Attachments

- We can attach `files`, `JSON dumps`, `text logs`, or `custom images` right into the test runner's report on the fly.

```js
test("Log API responses on failure", async ({ page }, testInfo) => {
  const apiData = { status: "Maintenance", code: 503 };

  // Directly append the raw backend data into the test report artifact pool
  await testInfo.attach("api-error-log.json", {
    contentType: "application/json",
    body: JSON.stringify(apiData),
  });
});
```

### Methods present in `test.info()`

#### 📋 1. Read-Only Properties (Test Context)

These properties allow test code to understand its environment dynamically at runtime:

- `testInfo.title`: The full string name of the currently running test.
- `testInfo.fn`: The actual JavaScript function body of the current test.
- `testInfo.file`: The absolute local system file path to the current test file.
- `testInfo.line` / `testInfo.column`: The exact code line and column position where this test is declared.
- `testInfo.retry`: The current retry attempt counter for this test (starts at 0 on the first run).
- `testInfo.workerIndex`: The unique numeric ID of the active worker process running this isolated test block.
- `testInfo.parallelIndex`: The unique numeric ID indicating the specific parallel execution slot (ranges from 0 to workers - 1).
- `testInfo.project`: An object containing full configuration details of the active Playwright project (e.g., testInfo.project.name, or testInfo.project.use settings).
- `testInfo.config`: The root-level global configuration object parsed straight out of your playwright.config.ts.
- `testInfo.status`: The current runtime status of the test (resolves to 'passed', 'failed', 'timedOut', or 'skipped').
- `testInfo.expectedStatus`: The predefined expectation set for this test (defaults to 'passed' unless marked as test.fail()).

#### 🛠️ 2. Read-Write Properties & Mutable Arrays

These allow you to append data to the test reporting pipeline dynamically as actions happen inside the browser:

- `testInfo.annotations`: An array where you can use .push({ type: 'x', description: 'y' }) to append customized tags to your HTML test report.
- `testInfo.attachments`: An array tracking files or assets bound to this test. (Though directly modifying this is rare; using the testInfo.attach() helper method is preferred).
- `testInfo.timeout`: Reads or overrides the active timeout countdown configuration in milliseconds for this specific test block.

#### ⚙️ 3. Execution Methods & Options (Utility Functions)

These functional helpers provide utilities to generate paths, bind trace files, or force-exit runtime execution:

- `testInfo.attach(name, options)`: Directly attaches text logs, images, or JSON file dumps right into the runner's report dashboard.
- `testInfo.outputPath(...pathSegments)`: Generates an absolute path targeting a folder within your designated outputDir. Perfect for isolating where screenshots or log files should save.
- `testInfo.snapshotPath(...pathSegments)`: Generates an absolute path targeting where visual snapshot/image comparison baselines are saved.
- `testInfo.setTimeout(timeout)`: Changes the timeout duration dynamically mid-execution if a specific workflow step is taking longer than initially budgeted.

## 7️⃣ Fail

- Sometimes a test is expected to fail due to a known bug, so we can fix it later.
- The Catch: If the test fails as expected, Playwright treats it as a success and keeps your build green.
- However, if the test passes, Playwright throws an error and fails your suite.
- `test.fail()` and `test.fixme()` are used to handle tests that are actively broken by known bugs.
- While both serve to keep your CI/CD pipeline "green" despite existing software defects, they handle test execution in fundamentally different ways.

```js
// 1. Expected failure validation
test.fail(process.env.ENV === "staging", "Known staging DB latency issue");

// Example: Tracking an active bug where form validation is broken
test("Broken username validation bug", async ({ page }) => {
  test.fail(true, "Issue #452: Submit button does not disable on empty input");

  await page.goto("/register");
  await expect(page.locator("#submit-btn")).toBeDisabled(); // This is currently failing
});
```

### Key Structural Differences

| Feature / Capability       | test.fail()                                      | test.fixme()                                   |
| -------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| Does it run the code?      | Yes, runs completely                             | No, skips immediately                          |
| What happens if it passes? | Fails the build (Alerts you)                     | Nothing (Code never runs)                      |
| Best Used For:             | Standard functional bugs                         | Crashes, timeouts, or infinite loops           |
| Conditional Control        | `test.fail(condition, reason)`                   | `test.fixme(condition, reason)`                |
| `test.describe` Usage      | `test.describe.fail()` fails every test under it | `test.describe.fixme()` Skips the entire group |

## 8️⃣ Fixme

- The `test.fixme()` annotation flags the test as broken
- Playwright will not execute the test code block and mark it as `fixme` in report.
- We can make conditional based `test.fixme()`

```js
// 1. Declaration signatures
test.fixme(title, body);
test.fixme(title, details, body);
test.fixme(condition, description);
test.fixme(callback, description);

// 2. Immediate execution block bypass
test.fixme(true, "Crash hazard: Fix required before running");
```

### 1. Condition Based execution

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

### 2. Describe block level fixme

You can mark all tests in a file or `test.describe([title, details, callback])` group as "fixme" based on some condition with a single `test.fixme(callback, description)` call.

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

### 3. Inside test body for single test case

- We can mark any single test case as `test.fixme()`
- Always provide a body message for identification: `test.fixme(title, body)`.

```js
import { test, expect } from "@playwright/test";

test("less readable", async ({ page }) => {
  test.fixme();
  // ...
});
```

## 9️⃣ Step

- User can create multiple steps inside a single test case
- Helps in debugging, reports understanding
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
    await expect(page.locator(".cart-count")).toHaveText("1");
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
