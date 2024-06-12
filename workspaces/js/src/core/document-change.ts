import { throttle } from "../lib/throttle";
import { startFlow } from "./public-methods";
import { FlowsContext } from "./flows-context";
import { getWaitMatchingByElement } from "./wait";

const _handleDocumentChange = (): void => {
  FlowsContext.getInstance().instances.forEach((state) => {
    if (state.waitingForElement) return state.render();

    const step = state.currentStep;
    if (step && "targetElement" in step && step.targetElement) {
      const el = document.querySelector(step.targetElement);
      const targetChanged = state.flowElement?.target && el !== state.flowElement.target;
      if (targetChanged) state.render();
    }

    if (step?.wait) {
      const matchingWait = getWaitMatchingByElement({ wait: step.wait });
      if (matchingWait) state.nextStep(matchingWait.targetBranch).render();
    }
  });

  Object.values(FlowsContext.getInstance().flowsById ?? {}).forEach((flow) => {
    if (!flow.start) return;
    const matchingWait = getWaitMatchingByElement({ wait: flow.start });
    if (matchingWait) startFlow(flow.id);
  });
};

export const handleDocumentChange = throttle(_handleDocumentChange, 250);
