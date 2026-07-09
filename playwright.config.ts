import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  retries: 1,
  workers: 1,
  reporter: "list",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3099",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "bun run dev --port 3099",
    url: "http://localhost:3099",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    cwd: ".",
  },
});
