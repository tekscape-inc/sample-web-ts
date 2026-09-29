import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  reporter: [["junit", { outputFile: ".factory/junit.xml" }], ["list"]],
  use: { baseURL: "http://127.0.0.1:4173", trace: "on", screenshot: "on" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: { command: "npm run build && npm run preview", port: 4173, reuseExistingServer: false },
});
