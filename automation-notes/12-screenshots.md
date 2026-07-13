# 🎭 Screenshots In Playwright

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

## Different Screenshot supported by Playwright

- Page Screenshot
- Full Page Screenshot
- Element Screenshot

## Page Screenshot

```js
// Test level screenshot
await page.screenshot({ path: "homePage.png" });

// Test level screenshot
await page.screenshot({
  path: `${folder_path}/${imageName}_${Date.now()}.png`,
});
```

## Full Page Screenshot

```js
import path from "node:path";

const screenshotName = (folder_path, imageName) => {
  return path.join(folder_path, `${imageName}_${Date.now()}.png`);
};

await page.screenshot({
  path: screenshotName("screenshots", "Test-Img-Name"),
  fullPage: true,
});
```

## Element Screenshot

```js
// Element screenshot
await page.locator("#btn").screenshot({ path: "homePage.png" });
```

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

## 🤖 Screenshot in Selenium

- Screenshot captured in selenium using `TakesScreenshot` interface but it has limitation.
- Only capture current view-port only
- To get full page screenshot need third party libs like `ashot`

```java
WebDriver driver = new ChromeDriver();

File src = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
File dest = new File("screenshot/homepage.png");

FileHandler.copy(src, dest);
```

## Interview Questions

#### Q: When We capture screenshots?

Ans:

- test failure
- before and after imp action
- visual verification
- reporting
- debugging
