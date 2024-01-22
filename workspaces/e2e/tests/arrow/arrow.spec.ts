import { test, expect } from "@playwright/test";

const placements = [
  "top",
  "right",
  "bottom",
  "left",
  "top-start",
  "top-end",
  "right-start",
  "right-end",
  "bottom-start",
  "bottom-end",
  "left-start",
  "left-end",
];

placements.forEach((placement) => {
  test(placement, async ({ page }) => {
    await page.goto(`/arrow/arrow.html?placement=${placement}`);
    await expect(page).toHaveScreenshot({ scale: "css", threshold: 0 });
  });
});

test("Shows the arrow", async ({ page }) => {
  await page.goto(`/arrow/arrow.html?placement=right`);
  await expect(page.locator(".flows-arrow")).toHaveCount(2);
});

test("Hides the arrow", async ({ page }) => {
  await page.goto(`/arrow/arrow.html?placement=right&hideArrow=true`);
  await expect(page.locator(".flows-arrow")).toHaveCount(0);
  await expect(page).toHaveScreenshot({ scale: "css", threshold: 0 });
});
