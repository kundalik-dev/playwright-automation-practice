import { test, expect } from "@playwright/test";

test.describe("Hooks in Playwright", () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();

    await page.goto("https://www.saucedemo.com/");

    //login
    await page.locator("#user-name").fill("standard_user");
    await page.locator("#password").fill("secret_sauce");
    await page.click("#login-button");
  });

  test.afterEach(async () => {
    //logout
    await page.locator(".bm-burger-button").click();
    await page.click("#logout_sidebar_link");

    await page.close();
  });

  test("login to saucedemo", async () => {
    // get products count
    const products = page.locator(".inventory_item");
    await expect(products).toHaveCount(6);
  });

  test("add product to cart", async () => {
    // add first product to cart
    await page.click("#add-to-cart-sauce-labs-backpack");
    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  });
});
