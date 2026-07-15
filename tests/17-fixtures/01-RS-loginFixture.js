import { test as base, expect } from "@playwright/test";

const userName = "kundalik.dev@gmail.com";
const passWord = "Admin@123";

const test = base.extend({
  rsLogin: async ({ page }, use) => {
    // setup
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page
      .getByPlaceholder("email@example.com", { exact: true })
      .fill(userName);
    await page
      .getByRole("textbox", { name: "enter your passsword" })
      .fill(passWord);
    await page.getByRole("button", { name: "Login" }).click();

    await use(page);

    // teardown
  },
});

export { test, expect };
