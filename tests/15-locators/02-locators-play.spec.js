import { test, expect } from "@playwright/test";

test.describe("playwright locators", () => {
  test("test01 playwright locators", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page.getByRole("c");

    // Assert
  });
});
