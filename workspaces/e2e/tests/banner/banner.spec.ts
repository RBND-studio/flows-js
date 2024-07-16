import test, { expect } from "@playwright/test";

const positions = ["top-left", "top-right", "bottom-left", "bottom-right"];

positions.forEach((position) => {
  test(position, async ({ page }) => {
    await page.goto("/banner/banner.html?position=" + position);
    await expect(page).toHaveScreenshot({ scale: "css" });
  });
});
