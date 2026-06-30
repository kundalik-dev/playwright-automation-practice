# Screenshots In Playwright

- Page Screenshot
- Full Page Screenshot
- Element Screenshot

## Page Screenshot

```js
// Test level screenshot
await page.screenshot({ path: "homePage.png" });

// Test level screenshot
await page.screenshot({
  path: `${folder_path}/${imgaeName}_${date.now()}.png`,
});
```

## Full Page Screenshot

```js
const imageName = `${folder_path}/${imgaeName}_${date.now()}.png`;

await page.screenshot({ path: imageName, fullPage: true });
```

## Element Screenshot

```js
// Element screenshot
await page.locator("#btn").screenshot({ path: "homePage.png" });
```

## Playwright.config.js

To capture screenshot we need to configure them from `playwright.config.js` file

```js
import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  use: {
    screenshot: "on",
  },
});
```

- `screenshot:"on"` => capture screenshot every time test runs
- `screenshot:"off"` => won't capture screenshot
- `screenshot:"on-first-failure"` => capture screenshot on first failure only not on retries
- `screenshot:"only-on-failure"` => captures screenshot every time a test fails. If a test fails on its initial run and fails again during its retries, a screenshot will be generated for every failed attempt.

### Helper function to name screenshot

```js
import path from "node:path";
import fs from "node:fs";

const SCREENSHOT_DIR = "screenshots";

// e.g. 2026-06-30_14-05-09
export function dateSuffix() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  return `${date}_${time}`;
}

export function screenshotDir() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  return SCREENSHOT_DIR;
}

export function screenshotName(imgName) {
  return path.join(screenshotDir(), `${imgName}-${dateSuffix()}.png`);
}
```
