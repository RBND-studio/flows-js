import type { FlowSteps } from "@flows/js";
import { init } from "@flows/js";

const lastStep = new URLSearchParams(window.location.search).get("lastStep") === "true";

const steps: FlowSteps = [
  {
    targetElement: ".target",
    title: "Hello",
    hideNext: true,
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
