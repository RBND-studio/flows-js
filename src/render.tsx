import { computePosition, offset, flip, shift, autoUpdate } from "@floating-ui/dom";
import type { FlowModalStep, FlowStep, FlowTooltipStep } from "./types";
import type { FlowState } from "./flow-state";

const updateTooltip = ({
  target,
  tooltip,
}: {
  target: Element;
  tooltip: HTMLElement;
}): Promise<void> =>
  computePosition(target, tooltip, {
    placement: "bottom",
    middleware: [
      offset(4),
      flip({ fallbackPlacements: ["top", "bottom", "left", "right"] }),
      shift({ padding: 4 }),
    ],
  })
    .then(({ x, y }) => {
      Object.assign(tooltip.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console -- Error log
      console.warn("Error computing position", err);
    });

const renderTooltip = ({
  root,
  step,
  state,
}: {
  root: HTMLElement;
  step: FlowTooltipStep;
  state: FlowState;
}): { cleanup: () => void } => {
  const tooltip = (
    <div className="flows-tooltip">
      <div>{step.title}</div>
      <div className="flows-tooltip-footer" test="a">
        {state.hasNextStep && <button className="flows-cancel">Close</button>}
        {state.hasPrevStep && <button className="flows-back">Back</button>}
        {state.hasNextStep ? (
          <button className="flows-continue">Continue</button>
        ) : (
          <button className="flows-finish">Finish</button>
        )}
      </div>
    </div>
  );
  root.appendChild(tooltip);
  const target = document.querySelector(step.element);
  if (!target) throw new Error(`Could not find element ${step.element}`);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises -- Promise is handled inside the updateTooltip
  const cleanup = autoUpdate(target, tooltip, () => updateTooltip({ target, tooltip }));
  return { cleanup };
};

const renderModal = ({
  root,
  step,
  state,
}: {
  root: HTMLElement;
  step: FlowModalStep;
  state: FlowState;
}): void => {
  const modal = (
    <div className="flows-modal-overlay">
      <div className="flows-modal">
        <div>{step.title}</div>
        <div className="flows-modal-footer">
          {state.hasNextStep && <button className="flows-cancel">Close</button>}
          {state.hasPrevStep && <button className="flows-back">Back</button>}
          {state.hasNextStep ? (
            <button className="flows-continue">Continue</button>
          ) : (
            <button className="flows-finish">Finish</button>
          )}
        </div>
      </div>
    </div>
  );
  root.appendChild(modal);
};

const isTooltipStep = (step: FlowStep): step is FlowTooltipStep => "element" in step;
const isModalStep = (step: FlowStep): step is FlowModalStep => !isTooltipStep(step);

export const render = (state: FlowState): void => {
  const step = state.currentStep;
  if (!step) return;

  state.cleanup();

  if ("wait" in step) return;
  const root = document.createElement("div");
  document.body.appendChild(root);
  if (isTooltipStep(step)) {
    const { cleanup } = renderTooltip({ root, step, state });
    state.flowElement = { element: root, cleanup };
  }
  if (isModalStep(step)) {
    renderModal({ root, step, state });
    state.flowElement = { element: root };
  }
};
