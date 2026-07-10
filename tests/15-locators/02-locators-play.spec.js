import { test, expect } from "@playwright/test";

test.describe("playwright locators getByRole", () => {
  test("test01 playwright locators", async ({ page }) => {
    // Arrange
    await page.goto("/12-locators");

    // Act
    await page.getByRole("button", { name: "Primary Action" });

    // Assert
  });
});
