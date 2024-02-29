import { expect, test } from "@playwright/test";

test("Enter branch by footerAction", async ({ page }) => {
  await page.goto("/branch/branch.html");
  await page.locator(".flows-option").nth(0).click();
  await expect(page.locator(".flows-tooltip")).toContainText("Variant 1");
  await page.locator(".flows-finish").click();
  await page.goto("/branch/branch.html");
  await page.locator(".flows-option").nth(1).click();
  await expect(page.locator(".flows-tooltip")).toContainText("Variant 2");
});
test("Enter branch by click", async ({ page }) => {
  await page.goto("/branch/branch.html");
  await page.locator(".enter-1").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Variant 1");
  await page.locator(".flows-finish").click();
  await page.goto("/branch/branch.html");
  await page.locator(".enter-2").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Variant 2");
});
test("Exits branch and returns to root step", async ({ page }) => {
  await page.goto("/branch/branch.html?lastStep=true");
  await page.locator(".enter-1").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Variant 1");
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Last Step");
});
test("branch can have multiple steps", async ({ page }) => {
  await page.goto("/branch/branch.html?lastStep=true");
  await page.locator(".enter-2").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Variant 2");
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Var 2 last step");
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Last Step");
});
test("should reset flow when entering branch without targetBranch", async ({ page }) => {
  await page.goto("/branch/branch.html?hideNext=false&logErrors=true");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator("[data-type='invalidStepError']")).toHaveCount(1);
});
test("should reset flow when entering out of bound step", async ({ page }) => {
  await page.goto("/branch/branch.html?lastStep=true&logErrors=true");
  await page.locator(".enter-1").click();
  await page.locator(".flows-continue").click();
  await page.locator(".flows-option").click();
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.locator(".start-flow").click();
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator("[data-type='invalidStepError']")).toHaveCount(1);
});
