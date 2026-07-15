// import { test, expect } from "@playwright/test";
import { test, expect } from "../17-fixtures/01-RS-loginFixture";

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

  test("test03 validate filtering between 12000 to 60000 return 1 product", async ({
    rsLogin,
    page,
  }) => {
    // Arrange
    await rsLogin.locator('#sidebar [placeholder="Min Price"]').fill("12000");
    await rsLogin.locator('#sidebar [placeholder="Max Price"]').fill("60000");

    await page.press('#sidebar [placeholder="Max Price"]', "Tab");
    // Act

    await expect(rsLogin.locator(".card-body b")).toHaveText("iphone 13 pro");

    console.log("Page title is => ", await page.title());

    // Assert
    await page.waitForTimeout(1500);
  });

  test("test04 validate filtering between 12000 to 60000 return 1 product", async ({
    rsLogin,
  }) => {
    const minPrice = rsLogin.locator('#sidebar [placeholder="Min Price"]');
    const maxPrice = rsLogin.locator('#sidebar [placeholder="Max Price"]');

    await minPrice.fill("12000");
    await maxPrice.fill("60000");
    await maxPrice.press("Tab"); // moves focus away, triggers the app's filter

    const products = rsLogin.locator(".card-body b");
    await expect(products).toHaveCount(1); // waits/retries until list shrinks to 1
    await expect(products).toHaveText("iphone 13 pro");
  });

  // THis is correct approach among three => 03 04
  test("test05 validate filtering between 12000 to 60000 shows only matching products", async ({
    rsLogin,
  }) => {
    const minPrice = rsLogin.locator('#sidebar [placeholder="Min Price"]');
    const maxPrice = rsLogin.locator('#sidebar [placeholder="Max Price"]');

    await minPrice.fill("10000");
    await maxPrice.fill("12000");
    await maxPrice.press("Tab");

    const products = rsLogin.locator(".card-body");

    // wait for filtering to actually change the list before reading it
    await expect(products).not.toHaveCount(3); // 3 = original unfiltered count

    const count = await products.count();
    expect(count).toBeGreaterThan(0); // sanity check: something matched

    for (let i = 0; i < count; i++) {
      const priceText = await products
        .nth(i)
        .locator(".//div[@class='text-muted']")
        .textContent(); // adjust selector to actual price element
      const price = Number(priceText.replace(/\D/g, ""));
      expect(price).toBeGreaterThanOrEqual(10000);
      expect(price).toBeLessThanOrEqual(12000);
    }
  });

  test("test06 validate filtering between 12000 to 60000 shows only matching products", async ({
    rsLogin,
  }) => {
    const minPriceLoc = rsLogin.locator('#sidebar [placeholder="Min Price"]');
    const maxPriceLoc = rsLogin.locator('#sidebar [placeholder="Max Price"]');

    const products = rsLogin.locator(".card-body");
    await expect(products.first()).toBeVisible();
    const beforeCount = await products.count();

    const minPrice = "10000";
    const maxPrice = "12000";

    await minPriceLoc.fill(minPrice);
    await maxPriceLoc.fill(maxPrice);
    await maxPriceLoc.press("Tab");

    // wait for filtering to actually change the list before reading it
    await expect(products).not.toHaveCount(beforeCount); // 3 = original unfiltered count

    const afterCount = await products.count();
    expect(afterCount).toBeGreaterThan(0); // sanity check: something matched

    for (let i = 0; i < afterCount; i++) {
      const priceText = await products
        .nth(i)
        .locator("xpath=.//div[@class='text-muted']")
        .textContent();
      const price = Number(priceText.replace(/\D/g, ""));
      expect(price).toBeGreaterThanOrEqual(Number(minPrice));
      expect(price).toBeLessThanOrEqual(Number(maxPrice));
    }
  });
});
