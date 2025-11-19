import { test, expect } from "@playwright/test";

test.skip(({ browserName }) => browserName !== "chromium", "Telemetry snapshot asserted in Chromium only");

test("serverless + CI dashboards render data", async ({ page }) => {
  await page.route("**/api/metrics/serverless", async (route) => {
    await route.fulfill({
      json: {
        provider: "stub",
        windowHours: 24,
        updatedAt: new Date().toISOString(),
        totals: { invocations: 42, errors: 0, avgDuration: 120 },
        functions: [
          {
            name: "api/demo",
            invocations: 42,
            errors: 0,
            avgDuration: 120,
            p95Duration: 180,
          },
        ],
        live: false,
      },
    });
  });

  await page.route("**/api/metrics/cicd", async (route) => {
    await route.fulfill({
      json: {
        provider: "stub",
        repo: "demo/demo",
        branch: "main",
        runs: [
          {
            id: "1",
            name: "Deploy main",
            status: "completed",
            conclusion: "success",
            commit: "1234567",
            url: "#",
            startedAt: new Date().toISOString(),
            durationSeconds: 40,
          },
        ],
        live: false,
      },
    });
  });

  await page.goto("/");
  await page
    .getByText("Serverless observability", { exact: false })
    .first()
    .scrollIntoViewIfNeeded();
  await page.waitForSelector('[data-testid="serverless-invocations"]', {
    state: "visible",
    timeout: 5000,
  });
  await expect(page.getByTestId("serverless-invocations")).toBeVisible({ timeout: 5000 });
  await page.getByText("CI/CD pipeline").first().scrollIntoViewIfNeeded();
  await expect(page.getByText("Deploy main", { exact: false })).toBeVisible();
});
