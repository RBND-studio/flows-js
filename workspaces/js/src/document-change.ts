import { FlowsContext } from "./flows-context";

export const handleDocumentChange = (): void => {
  FlowsContext.getInstance().instances.forEach((state) => {
    if (state.waitingForElement) state.render();

    const step = state.currentStep;
    if (step && "element" in step) {
      const el = document.querySelector(step.element);
      const targetChanged = state.flowElement?.target && el !== state.flowElement.target;
      if (targetChanged) state.render();
    }
  });
};
