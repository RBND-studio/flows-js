import type { Side } from "@floating-ui/dom";
import { computePosition, offset, flip, shift, autoUpdate, arrow } from "@floating-ui/dom";
import type { FlowModalStep, FlowTooltipStep, FooterActionItem, Placement } from "../types";
import { log } from "../lib/log";
import { isModalStep, isTooltipStep } from "../lib/step-type";
import type { FlowState } from "./flow-state";

const DISTANCE = 4;
const ARROW_SIZE = 6;
const BOUNDARY_PADDING = 8;
const ARROW_EDGE_PADDING = 8;

const updateTooltip = ({
  target,
  tooltip,
  placement,
  arrowEls,
  overlay,
  boundary,
}: {
  target: Element;
  tooltip: HTMLElement;
  placement?: Placement;
  arrowEls?: [HTMLElement, HTMLElement];
  overlay?: HTMLElement;
  boundary?: Element;
}): Promise<void> => {
  const offsetDistance = DISTANCE + (arrowEls ? ARROW_SIZE : 0);
  const middleware = [
    flip({ fallbackPlacements: ["top", "bottom", "left", "right"], boundary }),
    shift({ boundary, crossAxis: true, padding: BOUNDARY_PADDING }),
  ];
  if (arrowEls) middleware.push(arrow({ element: arrowEls[0], padding: ARROW_EDGE_PADDING }));
  middleware.push(offset(offsetDistance));

  if (overlay) {
    const targetPosition = target.getBoundingClientRect();
    overlay.style.top = `${targetPosition.top}px`;
    overlay.style.left = `${targetPosition.left}px`;
    overlay.style.width = `${targetPosition.width}px`;
    overlay.style.height = `${targetPosition.height}px`;
  }

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
      log.error("Error computing position", err);
    });
};

const getStepHeader = ({ step }: { step: FlowTooltipStep | FlowModalStep }): HTMLElement => (
  <div className="flows-header">
    <h1 className="flows-title" dangerouslySetInnerHTML={{ __html: step.title }} />
    {!step.hideClose && <button aria-label="Close" className="flows-cancel flows-close-btn" />}
  </div>
);
const getStepFooterActionButton = ({
  props,
  state,
}: {
  props: FooterActionItem;
  state: FlowState;
}): HTMLElement => {
  const classList = [];
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing is not intended here
  const variant = props.variant || "primary";

  if (variant === "primary") classList.push("flows-primary-btn");
  if (variant === "secondary") classList.push("flows-secondary-btn");
  if (props.cancel) classList.push("flows-cancel");
  if (props.prev) classList.push("flows-prev");
  if (props.next && state.hasNextStep) classList.push("flows-next");
  if (props.next && !state.hasNextStep) classList.push("flows-finish");
  if (props.targetBranch !== undefined) classList.push("flows-action");

  const className = classList.join(" ");

  if (props.href)
    return (
      <a className={className} href={props.href} target={props.external ? "_blank" : undefined}>
        {props.label}
      </a>
    );
  return (
    <button className={className} data-action={props.targetBranch}>
      {props.label}
    </button>
  );
};
const getNextButton = ({ state, label }: { state: FlowState; label?: string }): HTMLElement =>
  getStepFooterActionButton({
    props: {
      next: true,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing is not intended here
      label: label || (state.hasNextStep ? "Continue" : "Finish"),
    },
    state,
  });
const getPrevButton = ({ state, label }: { state: FlowState; label?: string }): HTMLElement =>
  getStepFooterActionButton({
    props: {
      prev: true,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing is not intended here
      label: label || "Back",
      variant: "secondary",
    },
    state,
  });

const getStepFooterActions = ({
  items,
  state,
}: {
  items?: FooterActionItem[];
  state: FlowState;
}): HTMLElement[] => (items ?? []).map((item) => getStepFooterActionButton({ props: item, state }));
const getStepFooter = ({
  state,
  step,
}: {
  step: FlowModalStep | FlowTooltipStep;
  state: FlowState;
}): HTMLElement | null => {
  const backBtn =
    state.hasPrevStep && !step.hidePrev && getPrevButton({ label: step.prevLabel, state });
  const continueBtn = !step.hideNext && getNextButton({ label: step.nextLabel, state });
  const leftOptions = getStepFooterActions({ items: step.footerActions?.left, state });
  const centerOptions = getStepFooterActions({ items: step.footerActions?.center, state });
  const rightOptions = getStepFooterActions({ items: step.footerActions?.right, state });
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
  boundary,
}: {
  root: HTMLElement;
  step: FlowTooltipStep;
  state: FlowState;
  target: Element;
  boundary?: Element;
}): { cleanup: () => void } => {
  const arrowEls = !step.hideArrow
    ? ([
        <div className="flows-arrow flows-arrow-bottom" />,
        <div className="flows-arrow flows-arrow-top" />,
      ] as [HTMLElement, HTMLElement])
    : undefined;

  const tooltip = (
    <div className="flows-tooltip">
      {getStepHeader({ step })}
      {step.body && <div className="flows-body" dangerouslySetInnerHTML={{ __html: step.body }} />}
      {getStepFooter({ state, step })}
      {arrowEls}
    </div>
  );

  let overlayEl: HTMLElement | undefined;
  if (step.overlay) {
    overlayEl = <div className="flows-tooltip-overlay" />;
    root.appendChild(overlayEl);

    const overlayClickLayer = (
      <div
        className={`flows-tooltip-overlay-click-layer${step.closeOnOverlayClick ? " flows-overlay-cancel" : ""}`}
      />
    );
    root.appendChild(overlayClickLayer);

    if (target instanceof HTMLElement || target instanceof SVGElement) {
      target.classList.add("flows-target");
      if (window.getComputedStyle(target).position === "static") target.style.position = "relative";
    }
  }

  root.appendChild(tooltip);

  const positionCleanup = autoUpdate(
    target,
    tooltip,
    () =>
      void updateTooltip({
        target,
        tooltip,
        placement: step.placement,
        arrowEls,
        overlay: overlayEl,
        boundary,
      }),
  );
  const cleanup = (): void => {
    positionCleanup();
    if (target instanceof HTMLElement || target instanceof SVGElement) {
      target.style.position = "";
      target.classList.remove("flows-target");
    }
  };
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
    <div className="flows-modal-wrapper">
      <div className="flows-modal">
        {getStepHeader({ step })}
        {step.body && (
          <div className="flows-body" dangerouslySetInnerHTML={{ __html: step.body }} />
        )}
        {getStepFooter({ state, step })}
      </div>
    </div>
  );
  if (!step.hideOverlay) {
    root.appendChild(
      <div
        className={`flows-modal-overlay${step.closeOnOverlayClick ? " flows-overlay-cancel" : ""}`}
      />,
    );
  }
  root.appendChild(modal);
};

const createRoot = (boundaryEl?: Element): HTMLElement => {
  const root = document.createElement("div");
  root.className = "flows-root";
  root.style.pointerEvents = "auto";
  if (boundaryEl) boundaryEl.appendChild(root);
  else document.body.appendChild(root);
  return root;
};

const getBoundaryEl = (state: FlowState): Element | undefined => {
  const boundary = state.flow?.rootElement ?? state.flowsContext.rootElement;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing is not intended here
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
