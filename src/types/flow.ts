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
  /**
   * On which side of the target element the tooltip should be placed.
   * @defaultValue `bottom`
   */
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

export type PrimitiveValue = string | number | boolean | null;
/**
 * Data types that can be compared.
 *
 * `Date` can also be supplied in ISO 8601 format to support sending dates in JSON.
 */
export type CompareValue = number | Date | string;
export interface UserPropertyMatch {
  /**
   * Key of the user property to perform the match on.
   */
  key: string;
  /**
   * Value must be a string and match the given regular expression.
   */
  regex?: string;
  /**
   * Value must be equal to the given value.
   */
  eq?: PrimitiveValue | PrimitiveValue[];
  /**
   * Value must not be equal to the given value.
   */
  ne?: PrimitiveValue | PrimitiveValue[];
  /**
   * Value must be greater than the given value.
   */
  gt?: CompareValue;
  /**
   * Value must be greater than or equal to the given value.
   */
  gte?: CompareValue;
  /**
   * Value must be less than the given value.
   */
  lt?: CompareValue;
  /**
   * Value must be less than or equal to the given value.
   */
  lte?: CompareValue;
  /**
   * Value must be found within string.
   * When array is given, at least one of the values must be contained.
   */
  contains?: string | string[];
  /**
   * Value must not be found within string.
   * When array is given, none of the values must be contained.
   */
  notContains?: string | string[];
}
/**
 * A group of user property matchers.
 * Each of the matchers must match for the group to match.
 */
export type UserPropertyMatchGroup = UserPropertyMatch[];

export interface Flow {
  id: string;
  frequency?: FlowFrequency;
  element?: string;
  /**
   * Draft flow will not be shown to users.
   * Draft flows can be started by calling `startFlow` draft parameter.
   * @defaultValue `false`
   */
  draft?: boolean;
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
  /**
   * Matchers for user properties.
   *
   * **One group**
   *
   * When array of matchers is given, all matchers must match for the Flow to run.
   * @example
   * *`plan` is "premium" AND `age` is grater then 18*
   * ```
   * [
   *   { key: "plan", eq: "premium" },
   *   { key: "age", gt: 18 },
   * ]
   * ```
   *
   * **Array of groups**
   *
   * When array of arrays of matchers is given, each of the array is a group of matchers. At least one of the groups must match for the Flow to run.
   *
   * @example
   * *(`plan` is "premium" AND `age` is grater then 18) OR (`age` is grater then 65)*
   * ```
   * [
   *   [
   *     { key: "plan", eq: "premium" },
   *     { key: "age", gt: 18 }
   *   ],
   *   [
   *     { key: "age", gt: 65 }
   *   ]
   * ]
   * ```
   */
  userProperties?: UserPropertyMatchGroup | UserPropertyMatchGroup[];
}
