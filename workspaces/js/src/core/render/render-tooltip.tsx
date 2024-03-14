import { computePosition, offset, flip, shift, autoUpdate, arrow } from "@floating-ui/dom";
import type { Side } from "@floating-ui/dom";
import { log } from "../../lib/log";
import type { FlowTooltipStep, Placement } from "../../types";
import type { FlowState } from "../flow-state";
import { createRoot, getStepFooter, getStepHeader } from "./render-common";

const DISTANCE = 4;
const ARROW_SIZE = 6;
const BOUNDARY_PADDING = 8;
const ARROW_EDGE_PADDING = 8;

/**
 * Function for updating tooltip, its overlay and arrow position.
 */
export const updateTooltip = ({
  target,
  tooltip,
  placement,
  arrowEls,
  overlay,
  boundary,
  options,
}: {
  target: Element;
  tooltip: HTMLElement;
  placement?: Placement;
  arrowEls?: [HTMLElement, HTMLElement];
  overlay?: HTMLElement;
  boundary?: Element;
  options?: {
    /**
     * @defaultValue true
     */
    flip?: boolean;
    /**
     * @defaultValue true
     */
    shift?: boolean;
  };
}): Promise<void> => {
  const offsetDistance = DISTANCE + (arrowEls ? ARROW_SIZE : 0);
  const middleware = [];
  if (options?.flip ?? true)
    middleware.push(flip({ fallbackPlacements: ["top", "bottom", "left", "right"], boundary }));
  if (options?.shift ?? true)
    middleware.push(shift({ boundary, crossAxis: true, padding: BOUNDARY_PADDING }));
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

/**
 * Function for rendering tooltip to HTMLElement without placing it in the DOM.
 * The tooltip won't be correctly positioned until `updateTooltip` is called.
 */
export const renderTooltipElement = ({
  step,
  root: _root,
  target: _target,
  isFirstStep,
  isLastStep,
}: {
  step: FlowTooltipStep;
  root?: HTMLElement;
  target?: Element;
  isLastStep: boolean;
  isFirstStep: boolean;
}): {
  root: HTMLElement;
  tooltip: HTMLElement;
  arrows?: [HTMLElement, HTMLElement];
  overlay?: HTMLElement;
} => {
  const root = _root ?? createRoot();
  const target = _target ?? document.querySelector(step.targetElement);

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
      {getStepFooter({ step, isFirstStep, isLastStep })}
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

  return { root, tooltip, arrows: arrowEls, overlay: overlayEl };
};

export const renderTooltip = ({
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
  const { tooltip, arrows, overlay } = renderTooltipElement({
    step,
    root,
    target,
    isFirstStep: !state.hasPrevStep,
    isLastStep: !state.hasNextStep,
  });

  const positionCleanup = autoUpdate(
    target,
    tooltip,
    () =>
      void updateTooltip({
        target,
        tooltip,
        placement: step.placement,
        arrowEls: arrows,
        overlay,
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
