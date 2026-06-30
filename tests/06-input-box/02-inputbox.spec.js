import { test, expect } from "@playwright/test";

test.describe("handle input elements", () => {
  test("handle input", async ({ page }) => {
    await page.goto("/");
  });
});
