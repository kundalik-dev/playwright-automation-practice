import { test, expect } from "@playwright/test";

test.describe("hooks tests", () => {
  test.beforeAll(async ({ browser }) => {
    console.log("Running before all");
  });

  test.afterAll(async () => {
    console.log("Running after All");
  });

  test.beforeEach(async ({ browser }) => {
    console.log("Running before each");
  });

  test.afterEach(async () => {
    console.log("Running after each");
  });

  test("Test 1", async ({ page }) => {
    console.log(`Running test 1`);
  });
  test("Test 2", async ({ page }) => {
    console.log(`Running test 2`);
  });
  test("Test 3", async ({ page }) => {
    console.log(`Running test 3`);
  });
  test("Test 4", async ({ page }) => {
    console.log(`Running test 4`);
  });
});
