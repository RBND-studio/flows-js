import type { FlowSteps } from "@flows/js";
import { init, startFlow } from "@flows/js/core";

const lastStep = new URLSearchParams(window.location.search).get("lastStep") === "true";
const hideNext = new URLSearchParams(window.location.search).get("hideNext") !== "false";

const steps: FlowSteps = [
  {
    targetElement: ".target",
    title: "Hello",
    hideNext,
    wait: [
      { clickElement: ".enter-1", targetBranch: 0 },
      { clickElement: ".enter-2", targetBranch: 1 },
    ],
    footerActions: {
      right: [
        { label: "1", targetBranch: 0 },
        { label: "2", targetBranch: 1 },
      ],
    },
  },
  [
    [
      {
        targetElement: ".target",
        title: "Variant 1",
      },
    ],
    [
      {
        targetElement: ".target",
        title: "Variant 2",
      },
      {
        targetElement: ".target",
        title: "Var 2 last step",
      },
    ],
  ],
];

if (lastStep)
  steps.push({
    targetElement: ".target",
    title: "Last Step",
    footerActions: { right: [{ label: "Continue", targetBranch: undefined }] },
  });

void init({
  flows: [
    {
      id: "flow",
      location: "/",
      steps,
    },
  ],
});

document.querySelector(".start-flow")?.addEventListener("click", () => {
  startFlow("flow");
});
