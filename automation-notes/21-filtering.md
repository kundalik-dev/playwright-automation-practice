# 🎭 Filtering in Playwright

## Scenario 01

- Filter products using `min` and `max` inputs.
- Then validate products are correctly filtered or not
- Should be robust for any number of products

```js
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
```

Approach 02 => clean but might not work

```js
test(" validate filtering between 10000 to 12000 shows only matching products", async ({
  rsLogin,
}) => {
  // 1. Descriptively named locators
  const minPriceInput = rsLogin.locator('#sidebar [placeholder="Min Price"]');
  const maxPriceInput = rsLogin.locator('#sidebar [placeholder="Max Price"]');
  const productCards = rsLogin.locator(".card-body");

  // 2. Clear values matching your internal logic (10k to 12k)
  const minPrice = 10000;
  const maxPrice = 12000;

  // Wait for initial network/DOM stability before interacting
  await expect(productCards.first()).toBeVisible();

  // 3. Fill filters and trigger search event
  await minPriceInput.fill(minPrice.toString());
  await maxPriceInput.fill(maxPrice.toString());
  await maxPriceInput.press("Tab");

  // 4. Robust wait: Wait specifically for network requests to finish settling
  await rsLogin.waitForLoadState("networkidle");

  // 5. Extract all visible text values in one fast parallel operation (No slow loops)
  const priceStrings = await productCards
    .locator(".text-muted")
    .allTextContents();

  // 6. Assert that we actually found matching filtered items
  expect(priceStrings.length).toBeGreaterThan(0);

  // 7. Validate all prices cleanly using native JavaScript array methods
  priceStrings.forEach((text) => {
    const cleanPrice = Number(text.replace(/\D/g, ""));

    expect(cleanPrice).toBeGreaterThanOrEqual(minPrice);
    expect(cleanPrice).toBeLessThanOrEqual(maxPrice);
  });
});
```
