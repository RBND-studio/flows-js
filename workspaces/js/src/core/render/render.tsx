import { isModalStep, isTooltipStep } from "../../lib/step-type";
import type { FlowState } from "../flow-state";
import { createRoot } from "./render-common";
import { renderModal } from "./render-modal";
import { renderTooltip } from "./render-tooltip";

const getBoundaryEl = (state: FlowState): Element | undefined => {
  const boundary = state.flow?.rootElement ?? state.flowsContext.rootElement;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing cannot be used here
  const boundaryEl = (boundary && document.querySelector(boundary)) || undefined;
  return boundaryEl;
};

export const render = (state: FlowState): void => {
  state.unmount();

  const step = state.currentStep;
  if (!step) return;

  if (isTooltipStep(step)) {
    const target = document.querySelector(step.targetElement);
    if (target) {
      const boundaryEl = getBoundaryEl(state);
      const root = createRoot(boundaryEl);
      const { cleanup } = renderTooltip({ root, step, state, target, boundary: boundaryEl });
      state.flowElement = { element: root, cleanup, target };
    } else {
      state.waitingForElement = true;
    }
  }
  if (isModalStep(step)) {
    const boundaryEl = getBoundaryEl(state);
    const root = createRoot(boundaryEl);
    renderModal({ root, step, state });
    state.flowElement = { element: root };
  }
};
