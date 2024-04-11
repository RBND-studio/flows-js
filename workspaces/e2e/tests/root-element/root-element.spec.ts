import { expect, test } from "@playwright/test";

test("should render in body by default", async ({ page }) => {
  await page.goto("/root-element/root-element.html");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".root").locator(".flows-tooltip")).toBeHidden();
});
test("should render in init root element", async ({ page }) => {
  await page.goto("/root-element/root-element.html?initRootElement=true");
  await expect(page.locator(".root").locator(".flows-tooltip")).toBeVisible();
});
test("should render in flow root element", async ({ page }) => {
  await page.goto("/root-element/root-element.html?flowRootElement=true");
  await expect(page.locator(".root").locator(".flows-tooltip")).toBeVisible();
});
test("should not render with missing root element", async ({ page }) => {
  await page.goto("/root-element/root-element.html?wrongInitRootElement=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await expect(page.locator(".wrong")).toBeHidden();
});
test("flow root element should override init root element", async ({ page }) => {
  await page.goto("/root-element/root-element.html?wrongInitRootElement=true&flowRootElement=true");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".root").locator(".flows-tooltip")).toBeVisible();
});

test("should not render modal with missing root element", async ({ page }) => {
  await page.goto("/root-element/root-element.html?modal=true&wrongInitRootElement=true");
  await expect(page.locator(".flows-modal")).toBeHidden();
  await expect(page.locator(".wrong")).toBeHidden();
});
test("should render modal in root element", async ({ page }) => {
  await page.goto("/root-element/root-element.html?initRootElement=true&modal=true");
  await expect(page.locator(".root").locator(".flows-modal")).toBeVisible();
});
