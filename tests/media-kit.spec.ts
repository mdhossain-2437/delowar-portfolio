import { test, expect } from "@playwright/test";

test("media kit page exposes downloads", async ({ page }) => {
  await page.goto("/media-kit");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(/media-kit/);
  await page.waitForFunction(() => {
    const root = document.getElementById("root");
    return root && root.textContent && root.textContent.length > 0;
  });
  await expect(page.getByRole("link", { name: "Download" }).first()).toHaveAttribute(
    "download",
  );
});
