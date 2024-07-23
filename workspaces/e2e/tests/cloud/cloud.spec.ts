import { expect, test } from "@playwright/test";
import { invalidFlow, validFlow } from "./flow-mocks";

test("Should validate local flow", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj", (route) =>
    route.fulfill({ json: { results: [] } }),
  );
  await page.goto("/cloud/cloud.html?validLocalFlow=true");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.goto("/cloud/cloud.html?invalidLocalFlow=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
});

test("Should run valid cloud flow", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj", (route) =>
    route.fulfill({ json: { results: [validFlow] } }),
  );
  await page.goto("/cloud/cloud.html");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});

test("Should run invalid cloud flow", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj", (route) =>
    route.fulfill({ json: { results: [invalidFlow] } }),
  );
  await page.goto("/cloud/cloud.html");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});

test("Should show preview flow", async ({ page }) => {
  await page.route(`**/sdk/flows/${validFlow.id}/draft?projectId=my-proj`, (route) =>
    route.fulfill({ json: validFlow }),
  );
  await page.goto(`/cloud/cloud.html?flows-flow-id=${validFlow.id}`);
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".flows-title")).toHaveText("Hello");
  await page.goto(`/cloud/cloud.html`);
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
