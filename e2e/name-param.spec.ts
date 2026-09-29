// Acceptance (card w-001): a ?name= query parameter personalises the #greeting heading.
import { expect, test } from "@playwright/test";

test.describe("?name= personalises the heading", () => {
  test("?name=Ada renders Hello, Ada!", async ({ page }) => {
    await page.goto("/?name=Ada");
    await expect(page.locator("h1#greeting")).toHaveText("Hello, Ada!");
  });

  test("missing name falls back to Hello, world!", async ({ page }) => {
    await page.goto("/?other=1");
    await expect(page.locator("h1#greeting")).toHaveText("Hello, world!");
  });

  test("empty name falls back to Hello, world!", async ({ page }) => {
    await page.goto("/?name=");
    await expect(page.locator("h1#greeting")).toHaveText("Hello, world!");
  });

  test("whitespace-only name falls back to Hello, world!", async ({ page }) => {
    await page.goto("/?name=%20%20%09");
    await expect(page.locator("h1#greeting")).toHaveText("Hello, world!");
  });

  test("URL-encoded name is decoded", async ({ page }) => {
    await page.goto("/?name=Ada%20Lovelace");
    await expect(page.locator("h1#greeting")).toHaveText("Hello, Ada Lovelace!");
  });

  test("name is rendered as text, never as markup", async ({ page }) => {
    await page.goto(`/?name=${encodeURIComponent("<b>Ada</b>")}`);
    const h1 = page.locator("h1#greeting");
    await expect(h1).toHaveText("Hello, <b>Ada</b>!");
    await expect(h1.locator("b")).toHaveCount(0);
  });
});
