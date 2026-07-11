import { test, expect } from "@playwright/test";

test("should handle iframes correctly", async ({ page }) => {
  // Navigate to the page containing the iframe
  await page.goto("/01-iframes/01-iframe.html");
  const frame = await page.frameLocator("#login-frame");
  await frame.getByRole("textbox", { name: "Username" }).fill("admin");
  await frame.getByRole("textbox", { name: "Password" }).fill("admin123");
  await frame.getByRole("button", { name: "Login" }).click();

  await expect(frame.locator("#login-message")).toHaveText(
    /Logged in successfully!/i,
  );

  await page.waitForTimeout(2000);
});
