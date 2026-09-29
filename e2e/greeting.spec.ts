// Characterization (card c-001): pins the greeting() export of src/main.ts, run in Node.
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const golden = (name: string): string =>
  readFileSync(new URL(`golden/greeting/${name}.txt`, import.meta.url), "utf8");

// src/main.ts touches `document` at import time; stub it so the module loads outside a browser
// and record what the import side effect does.
const queried: string[] = [];
const heading = { textContent: null as string | null };
let greeting: (name: string) => string;

test.beforeAll(async () => {
  (globalThis as unknown as { document: unknown }).document = {
    querySelector: (selector: string) => {
      queried.push(selector);
      return heading;
    },
  };
  ({ greeting } = await import("../src/main"));
});

test("typical name", () => {
  expect(`${greeting("Ada")}\n`).toBe(golden("ada"));
});

test("world", () => {
  expect(`${greeting("world")}\n`).toBe(golden("world"));
});

test("empty string", () => {
  expect(`${greeting("")}\n`).toBe(golden("empty"));
});

test("whitespace, markup, quotes and non-ASCII are passed through verbatim", () => {
  expect(`${greeting(" <b>O'Brien</b> & ünïcødé ")}\n`).toBe(golden("special"));
});

// CHARACTERIZED: current behaviour, possibly a bug — non-string input is interpolated, not rejected.
test("undefined input", () => {
  expect(`${greeting(undefined as unknown as string)}\n`).toBe(golden("undefined"));
});

// CHARACTERIZED: current behaviour, possibly a bug — non-string input is interpolated, not rejected.
test("null input", () => {
  expect(`${greeting(null as unknown as string)}\n`).toBe(golden("null"));
});

test("import side effect writes greeting('world') into #greeting", () => {
  expect(queried).toEqual(["#greeting"]);
  expect(heading.textContent).toBe("Hello, world!");
});
