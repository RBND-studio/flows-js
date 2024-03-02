import { throttle } from "../lib/throttle";
import { FlowsContext } from "./flows-context";

const _handleDocumentChange = (): void => {
  FlowsContext.getInstance().instances.forEach((state) => {
    if (state.waitingForElement) return state.render();

    const step = state.currentStep;
    if (step && "targetElement" in step) {
      const el = document.querySelector(step.targetElement);
      const targetChanged = state.flowElement?.target && el !== state.flowElement.target;
      if (targetChanged) state.render();
    }
  });
};

export const handleDocumentChange = throttle(_handleDocumentChange, 250);
