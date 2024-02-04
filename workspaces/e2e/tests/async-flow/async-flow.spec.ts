import { expect, test } from "@playwright/test";

test("Should not continue if flow is not fully loaded", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj", async (route) => {
    const json = [
      {
        id: "flow",
        location: "/",
        steps: [{ title: "First", element: ".target" }],
        _incompleteSteps: true,
      },
    ];
    await route.fulfill({ json });
  });
  await page.route("**/sdk/flows/flow?projectId=my-proj", (route) => route.abort());
  await page.goto("/async-flow/async-flow.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-tooltip")).toContainText("First");
});

test("Should continue if flow is fully loaded", async ({ page }) => {
  await page.route("**/sdk/flows?projectId=my-proj", async (route) => {
    const json = [
      {
        id: "flow",
        location: "/",
        steps: [{ title: "First", element: ".target" }],
        _incompleteSteps: true,
      },
    ];
    await route.fulfill({ json });
  });
  await page.route("**/sdk/flows/flow?projectId=my-proj", async (route) => {
    const json = {
      id: "flow",
      location: "/",
      steps: [
        { title: "First", element: ".target" },
        { title: "Second", element: ".target" },
      ],
    };
    await route.fulfill({ json });
  });
  await page.goto("/async-flow/async-flow.html");
  await expect(page.locator(".flows-tooltip")).toContainText("First");
  await page.locator(".flows-continue").click();
  await expect(page.locator(".flows-tooltip")).toContainText("Second");
});
