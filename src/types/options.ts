import type { Flow, FlowStep } from "./flow";
import type { UserProperties } from "./user";

export type FlowStepIndex = number | number[];
export interface TrackingEvent {
  type: "startFlow" | "nextStep" | "prevStep" | "finishFlow" | "cancelFlow";
  flowId: string;
  stepIndex?: FlowStepIndex;
  /**
   * Hash of the step definition
   */
  stepHash?: string;
  /**
   * Hash of the flow definition
   */
  flowHash: string;
  userId?: string;
  projectId: string;
}

/**
 * Options for Flows `init` function
 */
export interface FlowsOptions {
  flows?: Flow[];
  onNextStep?: (step: FlowStep) => void;
  onPrevStep?: (step: FlowStep) => void;
  tracking?: (event: TrackingEvent) => void;
  userId?: string;
  /**
   * Properties to set for the user used for targeting flows.
   */
  userProperties?: UserProperties;
  seenFlowIds?: string[];
  onSeenFlowIdsChange?: (seenFlowIds: string[]) => void;
  /**
   * The element to use as the root for elements created by Flows
   */
  rootElement?: string;
}
/**
 * Options for Flows with Cloud `init` function
 */
export interface FlowsCloudOptions extends FlowsOptions {
  projectId: string;
  customApiUrl?: string;
}
/**
 * Options for internal `init` function
 */
export type FlowsInitOptions = FlowsOptions & { projectId?: string };
export interface Instance {
  element: Element;
  flowId: string;
}

export interface StartFlowOptions {
  /**
   * If true, the flow will be started again even if it has already been seen.
   */
  again?: boolean;
}
export interface EndFlowOptions {
  /**
   * The type of event that caused the flow to end.
   * @defaultValue "cancel"
   */
  variant?: "finish" | "cancel";
}
