# Annotations & Tags in Playwright

Annotations and tags are provided in test so that we can filter test cases while running.

## Annotations

- describe
- Skip
- Only
- Failme
- Fail
- slow
- info
- step
- beforeAll
- afterAll
- beforeEach
- afterEach

## Tag Name

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

Annotations can be conditional based

```js
test("Test1", async ({ page, browserName }) => {
  if (browserName === "chromium") {
    test.skip();
  }
  console.log("Running Test 1");
});
```

### Slow

slow annotation slow down timeout by `three times` provided inside `playwright.config.js` file as `timeout:30_000`

### Info

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

### Fail

Sometime test intentionally failed so we can fix them later.

### Fixme

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

## Hooks
