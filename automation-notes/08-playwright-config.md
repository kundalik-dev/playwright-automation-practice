# Playwright.config.js file

- timeout ✅
- retries ✅
- fullyParallel
- workers
- reporter
- testDir
- forbidOnly

## Timeouts

- timeout can be set from playwrigh config file
- `timeout:20000` this is in milli seconds
- individual test timeout can be set using `test.setTimeout(5000)`

- inline timeout for any locator or action which has highest priority `page.click(..., { timeout: 2000 })`
- timeout: 20000 => max timeout for single test case
- globalTimeout: 600000 => Max time for the entire test run across all files
- expect => max timeout for assertions
- actionTimeout => Max time for locator actions like click(), fill(), hover() provided inside `use:{}`
- navigationTimeout => Max time for page.goto() or page.waitForNavigation() provided inside `use:{}`

```js
// playwright.config.js
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  // 1. Total Test Timeout: Max time allowed for a single test (including hooks)
  timeout: 30000, // 30 seconds

  // 2. Global Test Suite Timeout: Max time for the entire test run across all files
  globalTimeout: 600000, // 10 minutes

  expect: {
    // 3. Assertion Timeout: Max time for web assertions like expect(locator).toBeVisible()
    timeout: 5000, // 5 seconds
  },

  use: {
    // 4. Action Timeout: Max time for locator actions like click(), fill(), hover()
    actionTimeout: 10000, // 10 seconds

    // 5. Navigation Timeout: Max time for page.goto() or page.waitForNavigation()
    navigationTimeout: 15000, // 15 seconds
  },
});
```

## retries

- Number of times each test can retrie if failed
- Normally set to 2 in CI and in locally 0
- If test reties and then pass then it called as `flaky test`

### Retries can config

- test level
- project level
- playwright.config.js level
- CLI level using flag `--retries=3`

#### test level retires

```js
// Forces all tests inside this specific file to retry 3 times regardless of config
test.describe.configure({ retries: 3 });
```

#### Project level

```js
projects: [
  {
    name: "chromium-desktop",
    use: { ...devices["Desktop Chrome"] },
    retries: 0, // Very stable, needs no retries
  },
];
```

#### Playwright.config.js level

```js
 retries: process.env.CI ? 1 : 0,
```
