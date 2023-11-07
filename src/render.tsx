import type { Side } from "@floating-ui/dom";
import { computePosition, offset, flip, shift, autoUpdate, arrow } from "@floating-ui/dom";
import type { FlowModalStep, FlowTooltipStep, Placement } from "./types";
import type { FlowState } from "./flow-state";
import { isModalStep, isTooltipStep } from "./utils";
import { Icons } from "./icons";

const DISTANCE = 4;
const ARROW_SIZE = 6;

const updateTooltip = ({
  target,
  tooltip,
  placement,
  arrowEls,
}: {
  target: Element;
  tooltip: HTMLElement;
  placement?: Placement;
  arrowEls?: [HTMLElement, HTMLElement];
}): Promise<void> => {
  const offsetDistance = DISTANCE + (arrowEls ? ARROW_SIZE : 0);
  const middleware = [
    offset(offsetDistance),
    flip({ fallbackPlacements: ["top", "bottom", "left", "right"] }),
    shift({ padding: 4 }),
  ];
  if (arrowEls) middleware.push(arrow({ element: arrowEls[0] }));

  return computePosition(target, tooltip, {
    placement: placement ?? "bottom",
    middleware,
  })
    .then(({ x, y, middlewareData, placement: finalPlacement }) => {
      Object.assign(tooltip.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
      if (arrowEls && middlewareData.arrow) {
        const staticSide = ((): Side => {
          if (finalPlacement.includes("top")) return "bottom";
          if (finalPlacement.includes("bottom")) return "top";
          if (finalPlacement.includes("left")) return "right";
          return "left";
        })();
        const arrowX = middlewareData.arrow.x;
        const arrowY = middlewareData.arrow.y;
        const style = {
          // eslint-disable-next-line eqeqeq -- null check is intended here
          left: arrowX != null ? `${arrowX}px` : "",
          // eslint-disable-next-line eqeqeq -- null check is intended here
          top: arrowY != null ? `${arrowY}px` : "",
          right: "",
          bottom: "",
          [staticSide]: `${-ARROW_SIZE}px`,
        };
        arrowEls.forEach((el) => {
          Object.assign(el.style, style);
        });
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console -- Error log
      console.warn("Error computing position", err);
    });
};

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
  const backBtn = state.hasPrevStep && (
    <div className="flows-back-wrap">
      <button className="flows-back flows-button">Back</button>
    </div>
  );
  const continueBtn = getStepContinueButton({ state, step });
  const arrowEls = step.arrow
    ? ([
        <div className="flows-arrow flows-arrow-bottom" />,
        <div className="flows-arrow flows-arrow-top" />,
      ] as [HTMLElement, HTMLElement])
    : undefined;

  const tooltip = (
    <div className="flows-tooltip">
      <div className="flows-header">
        <h1 className="flows-title" dangerouslySetInnerHTML={{ __html: step.title }} />
        {state.hasNextStep && !step.hideClose && (
          <button
            aria-label="Close"
            className="flows-cancel flows-button"
            dangerouslySetInnerHTML={{ __html: Icons.close }}
          />
        )}
      </div>
      {step.body && <div className="flows-body" dangerouslySetInnerHTML={{ __html: step.body }} />}
      {(backBtn || (Array.isArray(continueBtn) ? continueBtn.length : continueBtn)) && (
        <div className="flows-tooltip-footer">
          {backBtn}
          {continueBtn}
        </div>
      )}
      {arrowEls}
    </div>
  );
  root.appendChild(tooltip);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises -- Promise is handled inside the updateTooltip
  const cleanup = autoUpdate(target, tooltip, () =>
    updateTooltip({ target, tooltip, placement: step.placement, arrowEls }),
  );
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
          {state.hasNextStep && (
            <button
              aria-label="Close"
              className="flows-cancel flows-button"
              dangerouslySetInnerHTML={{ __html: Icons.close }}
            />
          )}
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

const createRoot = (): HTMLElement => {
  const root = document.createElement("div");
  root.className = "flows-root";
  root.style.pointerEvents = "auto";
  document.body.appendChild(root);
  return root;
};

export const render = (state: FlowState): void => {
  const step = state.currentStep;
  if (!step) return;

  state.cleanup();

  if (isTooltipStep(step)) {
    const target = document.querySelector(step.element);
    if (target) {
      state.waitingForElement = false;
      const root = createRoot();
      const { cleanup } = renderTooltip({ root, step, state, target });
      state.flowElement = { element: root, cleanup };
    } else {
      state.waitingForElement = true;
    }
  }
  if (isModalStep(step)) {
    const root = createRoot();
    renderModal({ root, step, state });
    state.flowElement = { element: root };
  }
};
