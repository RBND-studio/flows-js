import { FlowTooltipStep } from "@flows/js";
import { FlowStep } from "@flows/js";
import { init } from "@flows/js/core";

const initRootElement =
  new URLSearchParams(window.location.search).get("initRootElement") === "true";
const flowRootElement =
  new URLSearchParams(window.location.search).get("flowRootElement") === "true";
const wrongInitRootElement =
  new URLSearchParams(window.location.search).get("wrongInitRootElement") === "true";
const wrongFlowRootElement =
  new URLSearchParams(window.location.search).get("wrongFlowRootElement") === "true";
const modal = new URLSearchParams(window.location.search).get("modal") === "true";

const step: FlowStep = {
  title: "Hello",
};
if (!modal) (step as FlowTooltipStep).targetElement = ".target";

init({
  rootElement: wrongInitRootElement ? ".wrong" : initRootElement ? ".root" : undefined,
  flows: [
    {
      id: "flow",
      rootElement: wrongFlowRootElement ? ".wrong" : flowRootElement ? ".root" : undefined,
      start: { location: "/" },
      steps: [step],
    },
  ],
});
