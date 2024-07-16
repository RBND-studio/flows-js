import "../lib/jsx";

import type { FlowsOptions } from "../types";
import { isValidFlow, isValidFlowsOptions, validateFlow, validateFlowsOptions } from "./validation";
import { init as _init } from "./init";

export {
  renderModalElement,
  renderTooltipElement,
  updateTooltip,
  renderBannerElement,
} from "./render";

export * from "./public-methods";
export const init: (options: FlowsOptions) => Promise<void> = _init;
export { isValidFlow, isValidFlowsOptions, validateFlow, validateFlowsOptions };
export type {
  Flow,
  FlowStep,
  FlowSteps,
  FooterActionItem,
  FlowsOptions,
  StartFlowOptions,
  TrackingEvent,
  FlowTooltipStep,
  FlowModalStep,
  FlowBannerStep,
  FlowWaitStep,
  WaitStepOptions,
} from "../types";
