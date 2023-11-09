import type { Placement as FloatingUiPlacement } from "@floating-ui/dom";

export type Placement = FloatingUiPlacement;

export interface FlowTooltipStep {
  key?: string;
  title: string;
  body?: string;
  element: string;
  options?: { text: string; action: number }[];
  placement?: Placement;
  hideClose?: boolean;
  arrow?: boolean;
  /**
   * The element to scroll to when the tooltip is shown.
   */
  scrollElement?: string;
}
export interface FlowModalStep {
  key?: string;
  title: string;
  body?: string;
  options?: { text: string; action: number }[];
}
export interface WaitStepOptions {
  element?: string;
  form?: {
    element: string;
    values: { element: string; value: string }[];
  };
  change?: {
    element: string;
    value: string | RegExp;
  }[];
  action?: number;
}
export interface FlowWaitStep {
  key?: string;
  wait: WaitStepOptions | WaitStepOptions[];
}
export type FlowStep = FlowModalStep | FlowTooltipStep | FlowWaitStep;
type Step = FlowStep | FlowStep[][];
export interface Flow {
  id: string;
  element?: string;
  steps: Step[];
}
export type FlowStepIndex = number | number[];
export interface TrackingEvent {
  type: "startFlow" | "nextStep" | "prevStep" | "finishFlow" | "cancelFlow";
  flowId: string;
  step: FlowStepIndex;
  userId?: string;
  customerId?: string;
}

export interface FlowsOptions {
  customerId?: string;
  flows?: Flow[];
  onNextStep?: (step: FlowStep) => void;
  onPrevStep?: (step: FlowStep) => void;
  tracking?: (event: TrackingEvent) => void;
  seenFlowIds?: string[];
  onSeenFlowIdsChange?: (seenFlowIds: string[]) => void;
}
export interface Instance {
  element: Element;
  flowId: string;
}
export interface FlowsContext {
  customerId?: string;
  userId?: string;
  flowsById?: Record<string, Flow>;
  onNextStep?: (step: FlowStep) => void;
  onPrevStep?: (step: FlowStep) => void;
  tracking?: (event: TrackingEvent) => void;
  seenFlowIds: string[];
  onSeenFlowIdsChange?: (seenFlowIds: string[]) => void;
}

export interface StartFlowOptions {
  /**
   * If true, the flow will be started again even if it has already been seen.
   */
  again?: boolean;
}
