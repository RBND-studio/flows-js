import type { FlowModalStep, FlowTooltipStep, FooterActionItem } from "../../types";
import { isTooltipStep } from "../../lib/step-type";

export const getStepHeader = ({ step }: { step: FlowTooltipStep | FlowModalStep }): HTMLElement => (
  <div className="flows-header">
    <h1 className="flows-title" dangerouslySetInnerHTML={{ __html: step.title }} />
    {!step.hideClose && <button aria-label="Close" className="flows-cancel flows-close-btn" />}
  </div>
);
export const getStepFooterActionButton = ({
  props,
  isLastStep,
}: {
  props: FooterActionItem;
  isLastStep?: boolean;
}): HTMLElement => {
  const classList = [];
  const variant = props.variant ?? "primary";

  if (variant === "primary") classList.push("flows-primary-btn");
  if (variant === "secondary") classList.push("flows-secondary-btn");
  if (props.cancel) classList.push("flows-cancel");
  if (props.prev) classList.push("flows-prev");
  if (props.next && !isLastStep) classList.push("flows-next");
  if (props.next && isLastStep) classList.push("flows-finish");
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
const getNextButton = ({
  isLastStep,
  label,
}: {
  isLastStep: boolean;
  label?: string;
}): HTMLElement =>
  getStepFooterActionButton({
    props: {
      next: true,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing is not suitable here
      label: label || (!isLastStep ? "Continue" : "Finish"),
    },
    isLastStep,
  });
const getPrevButton = ({ label }: { label?: string }): HTMLElement =>
  getStepFooterActionButton({
    props: {
      prev: true,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- nullish coalescing is not suitable here
      label: label || "Back",
      variant: "secondary",
    },
  });

const getStepFooterActions = ({
  items,
  isLastStep,
}: {
  items?: FooterActionItem[];
  isLastStep: boolean;
}): HTMLElement[] =>
  (items ?? []).map((item) => getStepFooterActionButton({ props: item, isLastStep }));
export const getStepFooter = ({
  step,
  isFirstStep,
  isLastStep,
}: {
  step: FlowModalStep | FlowTooltipStep;
  isLastStep: boolean;
  isFirstStep: boolean;
}): HTMLElement | null => {
  const backBtn = !isFirstStep && !step.hidePrev && getPrevButton({ label: step.prevLabel });
  const continueBtn = !step.hideNext && getNextButton({ label: step.nextLabel, isLastStep });
  const leftOptions = getStepFooterActions({ items: step.footerActions?.left, isLastStep });
  const centerOptions = getStepFooterActions({ items: step.footerActions?.center, isLastStep });
  const rightOptions = getStepFooterActions({ items: step.footerActions?.right, isLastStep });
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

export const createRoot = (boundaryEl?: Element): HTMLElement => {
  const root = document.createElement("div");
  root.className = "flows-root";
  root.style.pointerEvents = "auto";
  if (boundaryEl) boundaryEl.appendChild(root);
  else document.body.appendChild(root);
  return root;
};
