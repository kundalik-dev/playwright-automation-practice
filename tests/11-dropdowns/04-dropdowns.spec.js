import { test, expect } from "@playwright/test";

test.describe("Handling tables", () => {
  test("Test01 Handling auto suggest dropdown", async ({ page }) => {
    // Arrange
    await page.goto("/dropdowns");

    const serachTerm = "";
    // Act
    await page.getByRole("textbox", { name: "Search a city" });

    // Assert
  });
});
