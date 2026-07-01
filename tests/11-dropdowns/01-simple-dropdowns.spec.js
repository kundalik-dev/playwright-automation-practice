import { test, expect } from "@playwright/test";

test.describe("Handling Dropdowns", () => {
  test("Test01 Simple dropdowns", async ({ page }) => {
    // Arrange
    await page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    );

    // Act

    // Step 01 => Login to App
    test.step("Login to app", async () => {
      await page.getByRole("textbox", { name: "Username" }).fill("Admin");
      await page.getByRole("textbox", { name: "Password" }).fill("admin123");
      await page.getByRole("button", { name: "Login" }).click();
    });

    // Step 02 => Wait for home page
    await page.getByRole("heading", { name: "Dashboard" }).waitFor();

    // await expect(
    //   page.getByRole("paragraph", { name: "manda user" }),
    // ).toHaveText("manda user");

    await page.getByRole("link", { name: "PIM", exact: true }).click();

    // step 03 => PIM page navigate
    await page.getByRole("heading", { name: "PIM" }).waitFor();

    // 1. Target all input groups
    // 2. Filter down to the one containing the specific text
    // 3. Locate the dropdown inside that specific group
    await page
      .locator(".oxd-input-group")
      .filter({ hasText: "Employment Status" })
      .locator(".oxd-select-text-input")
      .click();

    await page.waitForTimeout(5000);

    // Assert
  });
});
