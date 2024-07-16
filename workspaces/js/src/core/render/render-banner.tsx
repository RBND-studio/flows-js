import { type FlowBannerStep } from "../../types";
import { type FlowState } from "../flow-state";
import { createRoot, getStepFooter, getStepHeader } from "./render-common";

export const renderBannerElement = ({
  step,
  isFirstStep,
  isLastStep,
  root: _root,
}: {
  step: FlowBannerStep;
  isLastStep: boolean;
  isFirstStep: boolean;
  root?: HTMLElement;
}): { root: HTMLElement } => {
  const root = _root ?? createRoot({ step });

  const position = step.bannerPosition ?? "bottom-right";

  const banner = (
    <div className={["flows-banner-wrapper", `flows-banner-${position}`].join(" ")}>
      <div className="flows-banner">
        {getStepHeader({ step })}
        {step.body && (
          <div className="flows-body" dangerouslySetInnerHTML={{ __html: step.body }} />
        )}
        {getStepFooter({ step, isFirstStep, isLastStep })}
      </div>
    </div>
  );
  root.appendChild(banner);

  return { root };
};

export const renderBanner = ({
  root,
  state,
  step,
}: {
  root: HTMLElement;
  step: FlowBannerStep;
  state: FlowState;
}): void => {
  renderBannerElement({
    step,
    root,
    isFirstStep: !state.hasPrevStep,
    isLastStep: !state.hasNextStep,
  });
};
