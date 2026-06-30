import { test, expect } from "@playwright/test";
import path from "node:path";
import { screenshotName } from "../../utils/helper";

test.describe("screenshot handling", () => {
  test("test01 current window screenshot", async ({ page }) => {
    await page.goto("/tabs-windows");

    const timeStamp = new Date().toISOString().replace(/[:.]/g, "-");

    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}`;

    const dirName = path.join("screenshots");

    await page.screenshot({
      path: `${dirName}/tabs-windows-${stamp}.png`,
    });
  });

  test("test02 capture current screenshot and attach to report", async ({
    page,
  }) => {
    await page.goto("/01-iframes/01-iframe.html");
    await page.screenshot({ path: screenshotName("my-name") });
    await page.waitForTimeout(1200);
  });

  test("test03 full page screenshot", async ({ page }) => {
    await page.goto("/tabs-windows");

    await page.screenshot({
      path: screenshotName("tabs-window-full-page"),
      fullPage: true,
    });
  });

  test("test04 locator screenshot", async ({ page }, testInfo) => {
    await page.goto("/01-iframes/01-iframe.html");

    const outerPath = screenshotName("first-locator");
    await page.locator("#outer-frame").screenshot({ path: outerPath });

    await page
      .frameLocator("#counter-frame")
      .getByRole("button", { name: "Increase" })
      .screenshot({ path: screenshotName("frame-locator-element") });

    await testInfo.attach("homepage-screenshot", {
      path: outerPath, // reads from the saved file instead of passing body
      contentType: "image/png",
    });
  });
});
