import { test, expect } from "@playwright/test";

test.describe("Interactive flows", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "Interactive flows run on Chromium only");
  test("achievement unlock via brutalism + audio visualizer", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Brutalism mode", { exact: false }).scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const btn = document.querySelector('[data-testid="brutalism-toggle"]') as
        | HTMLButtonElement
        | null;
      btn?.click();
    });
    await page.getByRole("button", { name: "Start visualizer" }).first().click();
    await expect(page.getByText("Achievement system", { exact: false })).toBeVisible();
  });

  test("avatar customization persists", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Avatar customization", { exact: false }).first().scrollIntoViewIfNeeded();
    await page.getByRole("checkbox", { name: "Glasses" }).first().check();
    await page.getByRole("checkbox", { name: "Hat" }).first().check();
    await page.reload();
    await page.locator('[data-testid="avatar-customizer"]').scrollIntoViewIfNeeded();
    await expect(page.getByRole("checkbox", { name: "Glasses" }).first()).toBeChecked({
      timeout: 10000,
    });
  });

  test("AI estimator flow", async ({ page }) => {
    await page.route("**/api/ai/estimate", async (route) => {
      await route.fulfill({
        json: {
          brief: "Need AI-powered booking dashboard",
          estimate: {
            timelineWeeks: 6,
            budgetUSD: 12000,
            confidence: 0.92,
            tags: ["ai", "dashboard"],
            rationale: "Stubbed response",
          },
          generatedAt: new Date().toISOString(),
        },
      });
    });
    await page.goto("/");
    await page.getByText("Drop a brief", { exact: false }).scrollIntoViewIfNeeded();
    await page.getByPlaceholder("Example: Build a React + Firebase booking system").fill(
      "Need AI-powered booking dashboard",
    );
    const responsePromise = page.waitForResponse("**/api/ai/estimate");
    await page.getByRole("button", { name: "Generate estimate" }).click();
    await responsePromise;
    await page.waitForSelector('[data-testid="estimate-result"]', {
      state: "visible",
      timeout: 5000,
    });
    await expect(page.getByTestId("estimate-result")).toBeVisible({ timeout: 30000 });
  });
});
