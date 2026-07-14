import { test, expect } from "@playwright/test";

test.describe("Annotations in playwright", () => {
  /**
   * only
   * skip
   * failme =>
   * fail =>
   * slow
   */

  test.describe.parallel("Annotations in playwright", () => {
    test("test1 @sanity", async ({ page }) => {
      console.log("Running test 1");
    });
  });

  test.fixme(
    ({ browserName }) => browserName === "webkit",
    "Should figure out the issue",
  );

  test("test1 @sanity", async ({ page }) => {
    console.log("Running test 1");
  });

  test("test2 @reg", async ({ page, browserName }) => {
    test.skip(browserName === "chromium", "Skipping test for chromium browser");
    console.log("Running test 2 with skip me using conditional skips");
    console.log(`Running test for ${browserName}`);
  });

  test("test3 @sanity @bug @fixme", async ({ page, browserName }) => {
    test.fixme(browserName == "firefox", "Test needs fixing for timeout");
    console.log("Running test 3");
  });

  test("test4 @sanity @reg", async ({ page }) => {
    console.log("Running test 4");
    test.info().attach("screenshot", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });

  test(
    "test5",
    {
      tag: ["@sanity", "@bug", "@reg"],
      annotation: {
        type: "issue",
        description: "https://github.com/microsoft/playwright/issues/23180",
      },
    },
    async ({ page }) => {
      console.log("Running test 5");
    },
  );

  // Slow down test execution for demonstration purposes
  test("test6 @slow", async ({ page }) => {
    test.slow();
    console.log("Running test 6");
  });
});
