import { test, expect } from "@playwright/test";

test.describe("handling filter on amazon", () => {
  test("search for mobiles under 15000 and validate display product range", async ({
    page,
  }) => {
    const searchTerm = "mobile phone under 15000";

    // Arrange
    await page.goto("https://www.amazon.in/");

    // Act
    const serachBoxLoc = page.getByRole("searchbox", {
      name: "Search Amazon.in",
    });

    // Search on amazon
    await serachBoxLoc.fill(searchTerm);
    await serachBoxLoc.press("Enter");

    // Wait for search cards to show
    await page.locator('[role="listitem"]').first().waitFor();

    const allProducts = await page.locator('[role="listitem"]').all();

    console.log("Number of products", allProducts.length);
    console.log("Number of products", async () => {
      await allProducts.forEach(async (element) => {
        await element.locator('data-cy="title-recipe"').textContent();
      });
    });

    // Assert
    await page.waitForTimeout(1500);
  });

  test("t01 search for mobiles under 15000 and validate display product range", async ({
    page,
  }) => {
    const searchTerm = "mobile phone under 15000";

    // 1. Arrange
    await page.goto("https://www.amazon.in/");

    // 2. Act
    const searchBoxLoc = page.getByRole("searchbox", {
      name: "Search Amazon.in",
    });
    await searchBoxLoc.fill(searchTerm);
    await searchBoxLoc.press("Enter");

    // 3. Precise Selection: Amazon uses 'data-component-type="s-search-result"' for product cards
    const productCards = page.locator(
      '[data-component-type="s-search-result"]',
    );

    // Explicitly wait for the first item to render to the DOM
    await expect(productCards.first()).toBeVisible();

    // 4. Fetch the total count accurately
    const totalProductsCount = await productCards.count();
    console.log(`Number of products found: ${totalProductsCount}`);

    // 5. Correct Loop implementation: Get all text contents in ONE quick call
    // Target the specific pricing/title container inside the card component
    const productTitles = await productCards
      .locator('h2, [data-cy="title-recipe"]')
      .allTextContents();

    // Log out all your fetched titles cleanly
    productTitles.forEach((title, index) => {
      console.log(`Product ${index + 1}: ${title.trim()}`);
    });

    // 6. Assert (Removed arbitrary hardcoded wait timeout)
    expect(productTitles.length).toBeGreaterThan(0);
  });
});
