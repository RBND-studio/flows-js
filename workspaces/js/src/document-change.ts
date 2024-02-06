import { FlowsContext } from "./flows-context";

export const handleDocumentChange = (): void => {
  FlowsContext.getInstance().instances.forEach((state) => {
    if (state.waitingForElement) state.render();

    const step = state.currentStep;
    if (step && "targetElement" in step) {
      const el = document.querySelector(step.targetElement);
      const targetChanged = state.flowElement?.target && el !== state.flowElement.target;
      if (targetChanged) state.render();
    }
  });
};
