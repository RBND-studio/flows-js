import { expect, test } from "@playwright/test";
import { invalidFlow, validFlow } from "./flow-mocks";

test("Should validate local flow", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj**", (route) =>
    route.fulfill({ json: { results: [] } }),
  );
  await page.goto("/cloud/cloud.html?validLocalFlow=true");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.goto("/cloud/cloud.html?invalidLocalFlow=true");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
});

test("Should run valid cloud flow", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj**", (route) =>
    route.fulfill({ json: { results: [validFlow] } }),
  );
  await page.goto("/cloud/cloud.html");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});

test("Should run invalid cloud flow", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj**", (route) =>
    route.fulfill({ json: { results: [invalidFlow] } }),
  );
  await page.goto("/cloud/cloud.html");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});

test("Should show preview flow", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj**", (route) =>
    route.fulfill({ json: { results: [] } }),
  );
  await page.route(`**/sdk/flows/${validFlow.id}/draft?projectId=my-proj`, (route) =>
    route.fulfill({ json: validFlow }),
  );
  await page.goto(`/cloud/cloud.html?flows-flow-id=${validFlow.id}`);
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".flows-title")).toHaveText("Hello");
  await expect(page.locator(".flows-preview-panel")).toBeVisible();
  await page.goto(`/cloud/cloud.html`);
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await expect(page.locator(".flows-title")).toHaveText("Hello");
  await expect(page.locator(".flows-preview-panel")).toBeVisible();
});

const hashedUserId =
  "4343cd4c8e4ab3025c1710bd79014401ed8ba9aaff328cac5a6c85292586e19023c35b0cfb0e09904004a003f272cdc5";

test("Should call reset all flows endpoint", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj**", (route) =>
    route.fulfill({ json: { results: [] } }),
  );
  await page.goto("/cloud/cloud.html");
  const reqPromise = page.waitForRequest((req) => {
    const url = req.url();
    return (
      url.includes(`/sdk/user/${hashedUserId}/progress`) &&
      url.includes("projectId=my-proj") &&
      !url.includes("flowId")
    );
  });
  await page.click(".reset-all");
  await reqPromise;
});
test("Should show flow again after reset all", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj**", (route) =>
    route.fulfill({ json: { results: [validFlow] } }),
  );
  await page.goto("/cloud/cloud.html");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.click(".flows-cancel");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.route("**/sdk/user/**", (route) => route.fulfill());
  await page.click(".reset-all");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});

test("Should call reset flow endpoint", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj**", (route) =>
    route.fulfill({ json: { results: [] } }),
  );
  await page.goto("/cloud/cloud.html");
  const reqPromise = page.waitForRequest((req) => {
    const url = req.url();
    console.log(url);
    return (
      url.includes(`/sdk/user/${hashedUserId}/progress`) &&
      url.includes("flowId=valid-flow") &&
      url.includes("projectId=my-proj")
    );
  });
  await page.click(".reset-valid-flow");
  await reqPromise;
});

test("Should show flow again after reset", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj**", (route) =>
    route.fulfill({ json: { results: [validFlow] } }),
  );
  await page.goto("/cloud/cloud.html");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
  await page.click(".flows-cancel");
  await expect(page.locator(".flows-tooltip")).toBeHidden();
  await page.route("**/sdk/user/**", (route) => route.fulfill());
  await page.click(".reset-valid-flow");
  await expect(page.locator(".flows-tooltip")).toBeVisible();
});
