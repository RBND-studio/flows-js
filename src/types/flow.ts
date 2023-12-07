import type { Placement as FloatingUiPlacement } from "@floating-ui/dom";

export type Placement = FloatingUiPlacement;

export interface StepOption {
  text: string;
  action: number;
}
export interface FlowTooltipStep {
  key?: string;
  title: string;
  body?: string;
  element: string;
  options?: StepOption[];
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
  options?: StepOption[];
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
  /**
   * A regular expression that matches the current pathname.
   * @example
   * ```
   * "/about" // matches "/about", "/company/about" and "/about/contact"
   * "^/about" // matches "/about" and "/about/contact"
   * "^/about$" // matches only "/about"
   * ```
   */
  location?: string;
  action?: number;
}
export interface FlowWaitStep {
  key?: string;
  wait: WaitStepOptions | WaitStepOptions[];
}
export type FlowStep = FlowModalStep | FlowTooltipStep | FlowWaitStep;
type Step = FlowStep | FlowStep[][];
export type FlowSteps = Step[];

export type FlowFrequency = "once" | "every-time";

export interface Flow {
  id: string;
  frequency?: FlowFrequency;
  element?: string;
  steps: Step[];
  /**
   * A regular expression that matches the current pathname.
   * @example
   * ```
   * "/about" // matches "/about", "/company/about" and "/about/contact"
   * "^/about" // matches "/about" and "/about/contact"
   * "^/about$" // matches only "/about"
   * ```
   */
  location?: string;
}
