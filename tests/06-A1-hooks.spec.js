import { test, expect } from "@playwright/test";

test.describe("Hooks in Playwright", () => {
  test("login to saucedemo", async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");

    //login
    await page.locator("#user-name").fill("standard_user");
    await page.locator("#password").fill("secret_sauce");
    await page.click("#login-button");

    // get products count
    const products = page.locator(".inventory_item");
    expect(await products.count()).toBe(6);

    //logout
    await page.locator(".bm-burger-button").click();
    await page.click("#logout_sidebar_link");

    page.close();
  });

  test("add product to cart", async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    // login
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");

    // add first product to cart
    await page.click("#add-to-cart-sauce-labs-backpack");
    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

    // Logout
    await page.click(".bm-burger-button");
    await page.click("#logout_sidebar_link");

    page.close();
  });
});
