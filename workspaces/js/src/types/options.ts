import type { FlowsContext } from "../core/flows-context";
import type { Flow, FlowStep } from "./flow";
import type { IdentifyUserOptions } from "./user";

export type FlowStepIndex = number | number[];
export type FlowEventType = "startFlow" | "nextStep" | "prevStep" | "finishFlow" | "cancelFlow";
export interface TrackingEvent {
  type: FlowEventType;
  flowId: string;
  stepIndex?: FlowStepIndex;
  /**
   * Hash of the step definition.
   */
  stepHash?: string;
  /**
   * Hash of the whole flow definition.
   */
  flowHash: string;
  userId?: string;
  projectId?: string;
  /**
   * Browser location
   * @example
   * - "/" - Root
   * - "/checkout"
   * - "/search?query=foo" - Query params are included
   */
  location: string;
  /**
   * Current step ID.
   */
  stepId?: string;
}
export type Tracking = (event: TrackingEvent) => void;

export interface OnFlowUpdateProps {
  /**
   * Previous step that user was on. Undefined if the flow has just started.
   */
  prevStep?: FlowStep;
  /**
   * The current step that user is on. Undefined if the flow has ended.
   */
  currentStep?: FlowStep;
  /**
   * The flow ID that the step belongs to.
   */
  flowId: string;
  /**
   * Browser location
   * @example
   * - "/" - Root
   * - "/checkout"
   * - "/search?query=foo" - Query params are included
   */
  location: string;
  /**
   * The type of event that caused the flow to update.
   */
  eventType: FlowEventType;
}
export type OnFlowUpdate = (props: OnFlowUpdateProps) => void;

export interface DebugEvent extends Omit<TrackingEvent, "type"> {
  type: "tooltipError" | "invalidateTooltipError" | "invalidStepError";
  /**
   * referenceId of the event that the current event is invalidating.
   */
  referenceId?: string;
  targetElement?: string;
}
export type Debug = (event: DebugEvent) => Promise<{ referenceId: string } | undefined>;

export interface SeenFlow {
  flowId: string;
  /**
   * The time the flow was finished, formatted in ISO 8601.
   */
  seenAt: string;
}

/**
 * Options for Flows `init` function
 */
export interface FlowsOptions extends IdentifyUserOptions {
  /**
   * The flows to be used in the application. When using Flows Cloud, flows are automatically loaded from the server but you can still provide local flows to be used in combination with the cloud flows.
   * @example
   * ``` js
   * [{
      id: "my-first-flow",
      element: "#start-flow-1",
      steps: [
        {
          element: "#start-flow-1",
          title: "Welcome to FlowsJS!",
          body: "This is a demo of FlowsJS. Click the button below to continue.",
        },
        {
          title: "This is a modal",
          body: "It is an useful way to show larger amounts of information.",
        },
      ],
    }]
    * ```
   * 
   */
  flows?: Flow[];
  /**
   * Method to be called when the user goes to the next step.
   */
  onNextStep?: (step: FlowStep) => void;
  /**
   * Method to be called when the user goes back to a previous step.
   */
  onPrevStep?: (step: FlowStep) => void;
  /**
   * Method to be called when a flow is started, ended or its step changes.
   */
  onFlowUpdate?: OnFlowUpdate;
  /**
   * Method for integrating 3rd party tracking tools. When using Flows Cloud, this is automatically managed.
   */
  tracking?: Tracking;
  /**
   * The flows that have been seen by the user. Used for controlling flow frequency. When using Flows Cloud with identified users, this is automatically managed.
   * @defaultValue []
   * @example
   * ```
   * // Load seenFlows from localStorage
   * JSON.parse(localStorage.getItem("flows-seen-flows") ?? "[]")
   * ```
   */
  seenFlows?: SeenFlow[];
  /**
   * Method to be called when the `seenFlows` change. When using Flows Cloud with identified users, this is automatically managed.
   * @example
   * ```
   * // Save seenFlows to localStorage
   * (seenFlows) => localStorage.setItem("flows-seen-flows", JSON.stringify(seenFlows))
   * ```
   */
  onSeenFlowsChange?: (seenFlows: SeenFlow[]) => void;
  /**
   * The element to use as the root for elements created by Flows. Useful when you need to render flows in a specific container.
   * @defaultValue "body"
   */
  rootElement?: string;
  /**
   * Method to be called when error events are triggered. Can be used to log errors or send them to a 3rd party service.
   */
  _debug?: Debug;
}
/**
 * Options for Flows with Cloud `init` function
 */
export interface FlowsCloudOptions extends FlowsOptions {
  /**
   * Flows Cloud project ID. You can find this in the Project settings page.
   */
  projectId: string;
  /**
   * Custom API URL for Flows Cloud. Useful for proxying requests.
   */
  customApiUrl?: string;
}
/**
 * Options for internal `init` function
 */
export type FlowsInitOptions = FlowsOptions & {
  projectId?: string;
  onLocationChange?: (pathname: string, context: FlowsContext) => void;
  onIncompleteFlowStart?: (flowId: string, context: FlowsContext) => void;
  loadFlow?: (flowId: string, options?: { draft?: boolean }) => Promise<Flow | undefined>;
  /**
   * Validate options and flows before initializing.
   * @defaultValue true
   */
  validate?: boolean;
};

export interface StartFlowOptions {
  /**
   * If true, the flow will be started again regardless if it has already been seen.
   */
  again?: boolean;
  /**
   * If true, both draft and published flows can be started.
   */
  startDraft?: boolean;
}
export interface EndFlowOptions {
  /**
   * The type of event that caused the flow to end.
   * @defaultValue "cancel"
   */
  variant?: "finish" | "cancel" | "no-event";
}
