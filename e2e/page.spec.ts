// Characterization (card c-001): pins the page as served by `npm run preview` on base.
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const golden = (name: string): string =>
  readFileSync(new URL(`golden/page/${name}.txt`, import.meta.url), "utf8");

test.describe("home page", () => {
  test("GET / responds 200 text/html", async ({ request }) => {
    const res = await request.get("/", { headers: { Accept: "text/html" } });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("text/html");
  });

  test("document title", async ({ page }) => {
    await page.goto("/");
    expect(`${await page.title()}\n`).toBe(golden("title"));
  });

  test("html lang attribute", async ({ page }) => {
    await page.goto("/");
    expect(await page.locator("html").getAttribute("lang")).toBe("en");
  });

  test("single #greeting h1 with rendered text", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveAttribute("id", "greeting");
    await expect(h1).toHaveText("Hello, world!");
    expect(`${await h1.textContent()}\n`).toBe(golden("heading"));
  });

  test("body text is only the greeting", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText("Hello, world!");
    expect(await page.locator("body").innerText()).toBe("Hello, world!");
  });
});

test.describe("unknown routes", () => {
  // CHARACTERIZED: current behaviour, possibly a bug — no 404; the preview server's SPA
  // fallback serves index.html with status 200 for any unknown path.
  for (const path of ["/does-not-exist", "/nested/deep/path", "/does-not-exist.txt"]) {
    test(`GET ${path} responds 200 with the home document`, async ({ request }) => {
      const home = await request.get("/", { headers: { Accept: "text/html" } });
      const res = await request.get(path, { headers: { Accept: "text/html" } });
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toBe("text/html");
      expect(await res.text()).toBe(await home.text());
    });
  }

  test("navigating to an unknown route renders the home page", async ({ page }) => {
    const res = await page.goto("/does-not-exist");
    expect(res?.status()).toBe(200);
    expect(`${await page.title()}\n`).toBe(golden("title"));
    await expect(page.locator("h1#greeting")).toHaveText("Hello, world!");
    expect(await page.locator("body").innerText()).toBe("Hello, world!");
    expect(new URL(page.url()).pathname).toBe("/does-not-exist");
  });
});
