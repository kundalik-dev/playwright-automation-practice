import { test, expect } from "@playwright/test";

test.describe("handle dropdown with redbus", () => {
  test("Test01 auto suggest drodowns", async ({ page }) => {
    // Arrange
    await page.goto("https://www.redbus.in/");

    // Act
    await page.getByLabel("From");

    // Assert
  });
});
