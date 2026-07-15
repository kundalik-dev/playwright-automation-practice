import { test, expect } from "@playwright/test";

test.describe("practice on client app of RS", () => {
  const userName = "kundalik.dev@gmail.com";
  const passWord = "Admin@123";

  test("test01 login to client app", async ({ page }) => {
    // Arrange
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

    // Act
    await page
      .getByPlaceholder("email@example.com", { exact: true })
      .fill(userName);
    await page
      .getByRole("textbox", { name: "enter your passsword" })
      .fill(passWord);
    await page.getByRole("button", { name: "Login" }).click();

    // Assert
    const signOutBtnTxt = await page.getByRole("button", { name: /Sign Out/ });
    await expect(signOutBtnTxt).toHaveText("Sign Out");
    await page.waitForTimeout(1500);
  });

  test("test02 validate first product text", async ({ page }) => {
    // Arrange
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");

    // Act
    await page
      .getByPlaceholder("email@example.com", { exact: true })
      .fill(userName);
    await page
      .getByRole("textbox", { name: "enter your passsword" })
      .fill(passWord);
    await page.getByRole("button", { name: "Login" }).click();

    // await page.waitForURL("**\/dashboard/dash");
    // await page.waitForLoadState("domcontentloaded");
    // await page.waitForLoadState("load");
    // await page.waitForLoadState("networkidle");

    // const productName = await page
    //   .locator(".card-body b")
    //   .first()
    //   .textContent();

    await expect(page.locator(".card-body b").first()).toBeVisible();

    const allProducts = await page.locator(".card-body b").allTextContents();
    // console.log(`01 textContent() => ${productName}`);
    console.log(`02 allTextContent() => ${allProducts}`);

    expect(allProducts.length).toBe(3);

    // Assert
    // expect(productName).toBe("ADIDAS ORIGINAL");
  });
});
