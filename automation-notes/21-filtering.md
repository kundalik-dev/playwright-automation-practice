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
