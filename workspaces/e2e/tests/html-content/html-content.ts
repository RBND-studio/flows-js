import type { FlowStep, FlowTooltipStep } from "@flows/js";
import { init } from "@flows/js";

const tooltip = new URLSearchParams(window.location.search).get("tooltip") === "true";

const step: FlowStep = {
  title: '<span class="span-in-title">span in title</span>',
  body: '<span class="span-in-body">span in body</span>',
};
if (tooltip) (step as FlowTooltipStep).element = ".target";

void init({
  flows: [
    {
      id: "flow",
      location: "/",
      steps: [step],
    },
  ],
});
