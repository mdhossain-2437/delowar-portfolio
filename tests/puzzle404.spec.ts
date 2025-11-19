import { test, expect } from "@playwright/test";

test("solving 404 puzzle unlocks redirect", async ({ page }) => {
  await page.goto("/404");
  await page.getByPlaceholder("Enter answer…").fill("15");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("Correct!", { exact: false })).toBeVisible();
});
