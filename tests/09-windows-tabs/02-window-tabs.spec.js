import { test, expect, chromium } from "@playwright/test";

test.describe("handling window and tabs", () => {
  test("test01 handling tabs", async ({ context }) => {
    // Arrange
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    const username = "kundalik.dev@gmail.com";
    const password = "Admin@123";

    await page1.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page1
      .getByRole("textbox", { name: "email@example.com" })
      .fill(username);

    await page1
      .getByRole("textbox", { name: "enter your passsword" })
      .fill(password);

    await page1.getByRole("button", { name: "Login" }).click();

    await page1.waitForURL("**/dashboard/dash");

    await page2.goto("https://rahulshettyacademy.com/client/#/dashboard/dash");

    console.log("Page title is ", await page2.title());

    const pageTwoUrl = await page2.url();
    await expect(pageTwoUrl).toContain(
      "https://rahulshettyacademy.com/client/#/dashboard/dash",
    );

    // Act
    console.log("Total pages opened", await context.pages().length);

    // Assert
    await page1.waitForTimeout(1500);
    await page2.waitForTimeout(1500);
  });

  test("test02 handling login popup flow", async ({ page, context }) => {
    // Arrange
    await page.goto("/tabs-windows");

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("button", { name: "Login with OAuth provider" }).click(),
    ]);

    await newPage
      .getByRole("textbox", { name: "Email address" })
      .fill("example@gmail.com");

    await newPage.getByRole("textbox", { name: "Password" }).fill("ADMIN");
    await newPage.getByRole("button", { name: "Authenticate" }).click();

    const authMsg = await page.locator("span.auth-badge.authed").textContent();

    await expect(authMsg).toContain("✓ Authenticated as example@gmail.com");

    // Assert
    await page.waitForTimeout(1500);
  });
});
