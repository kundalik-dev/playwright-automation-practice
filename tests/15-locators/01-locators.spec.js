import { test, expect } from "@playwright/test";

test.describe("handle locators", () => {
  test("Test01 handle locators", async ({ page }) => {
    // Arrange
    await page.goto(
      "https://theautomationzone.blogspot.com/2020/07/xpath-practice.html",
    );

    // Act
    console.log(
      "unique id text is:-",
      await page.locator('//*[@id="id1"]').textContent(),
    );

    console.log(
      "unique name text is:-",
      await page.locator('//*[@name="name1"]').textContent(),
    );

    console.log(
      "unique value text is:-",
      await page.locator('//*[text()="unique value"]').textContent(),
    );

    // AND
    console.log(
      "unique combination of attributes is:-",
      await page.locator("//* [ @name='a'  and @id='a' ]").textContent(),
    );

    // OR
    console.log(
      "unique combination of attributes is:-",
      await page.locator("//* [ @name='a'  and @id='b' ]").textContent(),
    );

    // Assert
  });
});
