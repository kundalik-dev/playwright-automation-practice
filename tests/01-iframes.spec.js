import { test, expect } from "@playwright/test";

test.describe("iframe practice", () => {
  test("iframe using frame object with name attribute", async ({ page }) => {
    await page.goto("http://localhost:3000/iframes/01-iframe.html");

    const frame = await page.frame("loginFrame");

    await frame.getByLabel("username").fill("admin");
    await frame.getByLabel("password").fill("admin123");

    await frame.getByRole("button", { name: "Login" }).click();

    await expect(frame.getByText("Logged in successfully!")).toHaveText(
      "Logged in successfully!",
    );
  });
});
