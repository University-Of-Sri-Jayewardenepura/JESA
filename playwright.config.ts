import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	testMatch: "**/*.e2e.ts",
	fullyParallel: true,
	retries: 1,
	workers: process.env.CI ? 1 : undefined,
	reporter: "list",
	timeout: 60_000,
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	webServer: {
		command: "bun run dev",
		url: "http://localhost:3000",
		reuseExistingServer: true,
		timeout: 60_000,
		cwd: ".",
	},
});
