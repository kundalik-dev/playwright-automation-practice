import { test, expect } from "@playwright/test";

test.describe("Handling auto-suggest dropdown", () => {
  test("test-01 handle auto suggest", async ({ page }) => {
    await page.goto("/dropdowns");

    const cityInput = page.locator("#city-input");
    await cityInput.fill("lon");

    const londonOption = page
      .locator("#city-suggestions li")
      .filter({ hasText: "London" });
    await expect(londonOption).toBeVisible();
    await londonOption.click();

    await expect(page.locator("#autocomplete-output")).toHaveText(
      "City: London",
    );
    await expect(cityInput).toHaveValue("London");
  });
});
