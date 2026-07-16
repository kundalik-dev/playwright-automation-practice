import { test, expect } from "@playwright/test";

test.describe("handling toHaveScreenshot", () => {
  test("test01 first tesr", async ({ page }) => {
    // Arrange
    await page.goto("/13-assertions/");

    // Act
    const locator = page.locator(".grid");
    await expect(locator).toHaveScreenshot("first-img.png");

    // Assert
    await page.waitForTimeout(1500);
  });
});
