import "./jsx";

import type {
  Flow,
  FlowStep,
  FlowSteps,
  FlowsOptions,
  StartFlowOptions,
  TrackingEvent,
  FlowTooltipStep,
  FlowModalStep,
  FlowWaitStep,
  WaitStepOptions,
} from "./types";
import { isValidFlow, isValidFlowsOptions, validateFlow, validateFlowsOptions } from "./validation";
import { init as _init } from "./init";

export * from "./public-methods";
export const init: (options: FlowsOptions) => Promise<void> = _init;
export { isValidFlow, isValidFlowsOptions, validateFlow, validateFlowsOptions };
export type {
  Flow,
  FlowStep,
  FlowSteps,
  FlowsOptions,
  StartFlowOptions,
  TrackingEvent,
  FlowTooltipStep,
  FlowModalStep,
  FlowWaitStep,
  WaitStepOptions,
};
