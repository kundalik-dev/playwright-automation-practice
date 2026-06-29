import { test, expect } from "@playwright/test";

test.describe("Annotations in playwright", () => {
  /**
   * only
   * skip
   * failme
   * fail
   * slow
   */
  test("test1", async ({ page }) => {
    console.log("Running test 1");
  });

  test("test2", async ({ page }) => {
    console.log("Running test 2");
  });

  test("test3", async ({ page }) => {
    console.log("Running test 3");
  });

  test("test4", async ({ page }) => {
    console.log("Running test 4");
  });
});
