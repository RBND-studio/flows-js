import type { FlowModalStep } from "..";
import type { FlowState } from "../flow-state";
import { createRoot, getStepFooter, getStepHeader } from "./render-common";

/**
 * Function for rendering modal element to HTMLElement without placing it in the DOM.
 */
export const renderModalElement = ({
  step,
  isFirstStep,
  isLastStep,
  root: _root,
}: {
  step: FlowModalStep;
  isLastStep: boolean;
  isFirstStep: boolean;
  root?: HTMLElement;
}): { root: HTMLElement } => {
  const root = _root ?? createRoot({ step });

  const modal = (
    <div className="flows-modal-wrapper">
      <div className="flows-modal">
        {getStepHeader({ step })}
        {step.body && (
          <div className="flows-body" dangerouslySetInnerHTML={{ __html: step.body }} />
        )}
        {getStepFooter({ step, isFirstStep, isLastStep })}
      </div>
    </div>
  );
  if (!step.hideOverlay) {
    root.appendChild(
      <div
        className={`flows-modal-overlay${step.closeOnOverlayClick ? " flows-overlay-cancel" : ""}`}
        style={step.disableOverlayClickLayer ? "pointer-events:none" : undefined}
      />,
    );
  }
  root.appendChild(modal);

  return { root };
};

export const renderModal = ({
  root,
  step,
  state,
}: {
  root: HTMLElement;
  step: FlowModalStep;
  state: FlowState;
}): void => {
  renderModalElement({
    step,
    root,
    isFirstStep: !state.hasPrevStep,
    isLastStep: !state.hasNextStep,
  });
};
