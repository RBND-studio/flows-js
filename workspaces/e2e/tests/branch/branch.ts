import type { FlowSteps } from "@flows/js";
import { init } from "@flows/js";

const lastStep = new URLSearchParams(window.location.search).get("lastStep") === "true";

const steps: FlowSteps = [
  {
    element: ".target",
    title: "Hello",
    hideNext: true,
    wait: [
      { element: ".enter-1", action: 0 },
      { element: ".enter-2", action: 1 },
    ],
    footerActions: {
      right: [
        { text: "1", action: 0 },
        { text: "2", action: 1 },
      ],
    },
  },
  [
    [
      {
        element: ".target",
        title: "Variant 1",
      },
    ],
    [
      {
        element: ".target",
        title: "Variant 2",
      },
      {
        element: ".target",
        title: "Var 2 last step",
      },
    ],
  ],
];

if (lastStep)
  steps.push({
    element: ".target",
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
