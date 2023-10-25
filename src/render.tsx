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

const getStepContinueButton = ({
  state,
  step,
}: {
  state: FlowState;
  step: FlowModalStep | FlowTooltipStep;
}): HTMLElement | HTMLElement[] => {
  if (!state.hasNextStep) return <button className="flows-finish flows-button">Finish</button>;
  if (!step.options) return <button className="flows-continue flows-button">Continue</button>;
  return step.options.map((option) => (
    <button className="flows-option flows-button" data-action={option.action}>
      {option.text}
    </button>
  ));
};

const renderTooltip = ({
  root,
  step,
  state,
  target,
}: {
  root: HTMLElement;
  step: FlowTooltipStep;
  state: FlowState;
  target: Element;
}): { cleanup: () => void } => {
  const tooltip = (
    <div className="flows-tooltip">
      <div className="flows-header">
        <h1 className="flows-title" dangerouslySetInnerHTML={{ __html: step.title }} />
        {state.hasNextStep && <button className="flows-cancel flows-button">Close</button>}
      </div>
      {step.body && <div className="flows-body" dangerouslySetInnerHTML={{ __html: step.body }} />}
      <div className="flows-tooltip-footer">
        {state.hasPrevStep && <button className="flows-back flows-button">Back</button>}
        {getStepContinueButton({ state, step })}
      </div>
    </div>
  );
  root.appendChild(tooltip);
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
        <div className="flows-header">
          <h1 className="flows-title" dangerouslySetInnerHTML={{ __html: step.title }} />
          {state.hasNextStep && <button className="flows-cancel flows-button">Close</button>}
        </div>
        {step.body && (
          <div className="flows-body" dangerouslySetInnerHTML={{ __html: step.body }} />
        )}
        <div className="flows-modal-footer">
          {state.hasPrevStep && <button className="flows-back flows-button">Back</button>}
          {getStepContinueButton({ state, step })}
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
    const target = document.querySelector(step.element);
    if (target) {
      state.waitingForElement = false;
      const { cleanup } = renderTooltip({ root, step, state, target });
      state.flowElement = { element: root, cleanup };
    } else {
      state.waitingForElement = true;
      root.remove();
    }
  }
  if (isModalStep(step)) {
    renderModal({ root, step, state });
    state.flowElement = { element: root };
  }
};
