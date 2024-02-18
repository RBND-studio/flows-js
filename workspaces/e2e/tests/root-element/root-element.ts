import { init } from "@flows/js/core";

const initRootElement =
  new URLSearchParams(window.location.search).get("initRootElement") === "true";
const flowRootElement =
  new URLSearchParams(window.location.search).get("flowRootElement") === "true";
const wrongInitRootElement =
  new URLSearchParams(window.location.search).get("wrongInitRootElement") === "true";
const wrongFlowRootElement =
  new URLSearchParams(window.location.search).get("wrongFlowRootElement") === "true";

console.log({
  rootElement: wrongInitRootElement ? ".wrong" : initRootElement ? ".root" : undefined,
  flows: [
    {
      id: "flow",
      rootElement: wrongFlowRootElement ? ".wrong" : flowRootElement ? ".root" : undefined,
      location: "/",
      steps: [
        {
          targetElement: ".target",
          title: "Hello",
        },
      ],
    },
  ],
});

init({
  rootElement: wrongInitRootElement ? ".wrong" : initRootElement ? ".root" : undefined,
  flows: [
    {
      id: "flow",
      rootElement: wrongFlowRootElement ? ".wrong" : flowRootElement ? ".root" : undefined,
      location: "/",
      steps: [
        {
          targetElement: ".target",
          title: "Hello",
        },
      ],
    },
  ],
});
