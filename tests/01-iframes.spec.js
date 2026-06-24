import { test, expect } from "@playwright/test";

test.describe("iframe practice", () => {
  test("iframe using frame object with name attribute", async ({ page }) => {
    await page.goto("/iframes/01-iframe.html");

    const frame = await page.frame("loginFrame");

    await frame.getByLabel("username").fill("admin");
    await frame.getByLabel("password").fill("admin123");

    await frame.getByRole("button", { name: "Login" }).click();

    await expect(frame.getByText("Logged in successfully!")).toHaveText(
      "Logged in successfully!",
    );
  });

  test("iframe using frameLocator", async ({ page }) => {
    await page.goto("/iframes/01-iframe.html");

    const frameLoc = await page.frameLocator("#login-frame");

    await page
      .frameLocator("#login-frame")
      .getByRole("textbox", { name: "username" })
      .fill("admin");

    await frameLoc.getByRole("textbox", { name: "password" }).fill("admin123");

    await frameLoc.getByRole("button", { name: "Login" }).click();

    await expect(frameLoc.locator("#login-message")).toHaveText(
      "Logged in successfully!",
    );
  });

  test("iframe 2 using frame object for counter iframe", async ({ page }) => {
    await page.goto("/iframes/01-iframe.html");

    const frame = await page.frame("counterFrame");

    await frame.locator("#increment-btn").click();
    await frame.locator("#increment-btn").click();
    await frame.locator("#increment-btn").click();

    await expect(frame.locator("#counter-value")).toHaveText("3");
  });

  test("iframe 3 using frame object for multi frames", async ({ page }) => {
    await page.goto("/iframes/01-iframe.html");

    const frame = await page.frame("innerFrame2");

    await frame.getByPlaceholder("Type here").fill("Testing");

    await frame.getByRole("button", { name: "Submit" }).click();

    await expect(frame.locator("#inner-2-output")).toHaveText(
      "Submitted: Testing",
    );
  });

  /**
   * Frame locator chaining
   * inside frameLocator user normal how we use locator like for id we use #id and class we use .class
   */
  test("iframe 4 frameLocator for inner frame1", async ({ page }) => {
    await page.goto("/iframes/01-iframe.html");

    const frameLoc = await page
      .frameLocator("#outer-frame")
      .frameLocator("#inner-frame-1");

    await frameLoc.getByRole("button", { name: "Click Me" }).click();

    await expect(frameLoc.getByRole("paragraph")).toHaveText(
      "Inner frame 1 button clicked!",
    );
  });
});
