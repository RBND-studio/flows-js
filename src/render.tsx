import type { Side } from "@floating-ui/dom";
import { computePosition, offset, flip, shift, autoUpdate, arrow } from "@floating-ui/dom";
import type { FlowModalStep, FlowTooltipStep, FooterActionItem, Placement } from "./types";
import type { FlowState } from "./flow-state";
import { isModalStep, isTooltipStep } from "./utils";
import { Icons } from "./icons";
import { log } from "./log";

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
    flip({ fallbackPlacements: ["top", "bottom", "left", "right"] }),
    shift({ padding: 4 }),
  ];
  if (arrowEls) middleware.push(arrow({ element: arrowEls[0], padding: 8 }));
  middleware.push(offset(offsetDistance));

  return computePosition(target, tooltip, {
    placement,
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
      log.error("Error computing position\n", err);
    });
};

const getContinueButton = ({
  state,
  step,
}: {
  step: FlowTooltipStep | FlowModalStep;
  state: FlowState;
}): HTMLElement =>
  state.hasNextStep ? (
    <button className="flows-continue flows-button">{step.nextText || "Continue"}</button>
  ) : (
    <button className="flows-finish flows-button">{step.nextText || "Finish"}</button>
  );
const getBackButton = ({
  state: _state,
  step,
}: {
  step: FlowTooltipStep | FlowModalStep;
  state: FlowState;
}): HTMLElement => <button className="flows-back flows-button">{step.prevText || "Back"}</button>;
const getStepFooterActionButton = ({
  props,
  state,
  step,
}: {
  props: FooterActionItem;
  state: FlowState;
  step: FlowModalStep | FlowTooltipStep;
}): HTMLElement => {
  if (props.prev) return getBackButton({ step, state });
  if (props.next) return getContinueButton({ step, state });
  const buttonClassName = "flows-option flows-button";
  if (props.href)
    return (
      <a
        className={buttonClassName}
        href={props.href}
        target={props.external ? "_blank" : undefined}
      >
        {props.text}
      </a>
    );
  return (
    <button className={buttonClassName} data-action={props.action}>
      {props.text}
    </button>
  );
};
const getStepFooterActions = ({
  items,
  state,
  step,
}: {
  items?: FooterActionItem[];
  step: FlowModalStep | FlowTooltipStep;
  state: FlowState;
}): HTMLElement[] =>
  (items ?? []).map((item) => getStepFooterActionButton({ props: item, state, step }));
const getStepFooter = ({
  state,
  step,
}: {
  step: FlowModalStep | FlowTooltipStep;
  state: FlowState;
}): HTMLElement | null => {
  const backBtn = state.hasPrevStep && !step.hidePrev && getBackButton({ step, state });
  const continueBtn = !step.hideNext && getContinueButton({ state, step });
  const leftOptions = getStepFooterActions({ items: step.footerActions?.left, state, step });
  const centerOptions = getStepFooterActions({ items: step.footerActions?.center, state, step });
  const rightOptions = getStepFooterActions({ items: step.footerActions?.right, state, step });
  const someFooterBtn =
    backBtn || continueBtn || leftOptions.length || centerOptions.length || rightOptions.length;
  if (!someFooterBtn) return null;

  const isTooltip = isTooltipStep(step);

  return (
    <div className="flows-footer">
      <div>
        {isTooltip && backBtn}
        {leftOptions}
      </div>
      <div>
        {!isTooltip && backBtn}
        {centerOptions}
        {!isTooltip && continueBtn}
      </div>
      <div>
        {rightOptions}
        {isTooltip && continueBtn}
      </div>
    </div>
  );
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
  const arrowEls = !step.hideArrow
    ? ([
        <div className="flows-arrow flows-arrow-bottom" />,
        <div className="flows-arrow flows-arrow-top" />,
      ] as [HTMLElement, HTMLElement])
    : undefined;

  const tooltip = (
    <div className="flows-tooltip">
      <div className="flows-header">
        <h1 className="flows-title" dangerouslySetInnerHTML={{ __html: step.title }} />
        {!step.hideClose && (
          <button
            aria-label="Close"
            className="flows-cancel flows-button"
            dangerouslySetInnerHTML={{ __html: Icons.close }}
          />
        )}
      </div>
      {step.body && <div className="flows-body" dangerouslySetInnerHTML={{ __html: step.body }} />}
      {getStepFooter({ state, step })}
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
          {!step.hideClose && (
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
        {getStepFooter({ state, step })}
      </div>
    </div>
  );
  root.appendChild(modal);
};

const createRoot = (parent?: string): HTMLElement => {
  const root = document.createElement("div");
  root.className = "flows-root";
  root.style.pointerEvents = "auto";
  if (parent) document.querySelector(parent)?.appendChild(root);
  else document.body.appendChild(root);
  return root;
};

export const render = (state: FlowState): void => {
  const step = state.currentStep;
  if (!step) return;

  state.unmount();

  if (isTooltipStep(step)) {
    const target = document.querySelector(step.element);
    if (target) {
      const root = createRoot(state.flowsContext.rootElement);
      const { cleanup } = renderTooltip({ root, step, state, target });
      state.flowElement = { element: root, cleanup, target };
    } else {
      state.waitingForElement = true;
    }
  }
  if (isModalStep(step)) {
    const root = createRoot(state.flowsContext.rootElement);
    renderModal({ root, step, state });
    state.flowElement = { element: root };
  }
};
