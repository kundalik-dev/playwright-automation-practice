import { test, expect } from "@playwright/test";

test.describe("handling window and tabs", () => {
  test("test01 handling tabs", async ({ page }) => {
    // Arrange
    await page.goto("/tabs-windows/");

    // Act

    // Assert
    await page.waitForTimeout(1500);
  });
});
