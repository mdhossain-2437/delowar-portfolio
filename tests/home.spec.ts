import { test, expect } from "@playwright/test";

test.describe("Home experience", () => {
  test("renders critical telemetry + showcases", async ({ page }) => {
    await page.goto("/");

    await page.waitForSelector('text=/Edge personalization/i', { timeout: 30000 });
    await expect(page.getByText("Edge personalization", { exact: false })).toBeVisible();
    await expect(page.getByText("Micro-frontend showcase")).toBeVisible();
    await expect(page.getByText("Pre-caching strategy")).toBeVisible();
    await expect(page.getByText("Serverless observability")).toBeVisible();
    await expect(page.getByText("CI/CD pipeline")).toBeVisible();
    await expect(page.getByText("Audio Reactive Lab")).toBeVisible();
    await expect(page.getByText("Turn-based bug smashing mini-game")).toBeVisible();

    await page.getByRole("button", { name: "Show precache list" }).click();
    await expect(page.getByText("precached", { exact: false })).toBeVisible();
  });
});
