import type { Placement as FloatingUiPlacement } from "@floating-ui/dom";

export type Placement = FloatingUiPlacement;

export interface FooterActionItem {
  text: string;
  /**
   * The branch of the next step to go to.
   */
  action?: number;
  /**
   * Act as a previous step button
   */
  prev?: boolean;
  /**
   * Act as a next step button
   */
  next?: boolean;
  /**
   * Act as a link to the given URL
   */
  href?: string;
  /**
   * `target="_blank"` - open the link in a new tab.
   */
  external?: boolean;
}
export interface FooterActions {
  left?: FooterActionItem[];
  center?: FooterActionItem[];
  right?: FooterActionItem[];
}
export interface FlowTooltipStep {
  /**
   * Optional key to identify the step. Useful for controlling the flow programmatically with `getCurrentStep()`.
   */
  key?: string;
  /**
   * Title of the tooltip.
   */
  title: string;
  /**
   * Body of the tooltip. Supports HTML.
   */
  body?: string;
  /**
   * Element to attach tooltip to.
   */
  element: string;
  /**
   * On which side of the target element the tooltip should be placed.
   * @defaultValue `bottom`
   */
  placement?: Placement;
  /**
   * Highlight the target element with an overlay.
   * @defaultValue `false`
   */
  overlay?: boolean;
  /**
   * Close the tooltip when the overlay is clicked.
   * @defaultValue `false`
   */
  closeOnOverlayClick?: boolean;
  /**
   * Hide the arrow pointing to the target element.
   */
  hideArrow?: boolean;
  /**
   * Hide the close button. Without the close button the user will not be able to close the tooltip.
   */
  hideClose?: boolean;
  /**
   * Hide the previous button. Without the previous button the user will not be able to go back.
   */
  hidePrev?: boolean;
  /**
   * Hide the next button.
   * This option should be used with `footerActions` to provide a way to go to the next step or by controlling the flow programmatically with `nextStep()`.
   */
  hideNext?: boolean;
  /**
   * Text of the previous and next buttons.
   * @defaultValue `Back`
   */
  prevText?: string;
  /**
   * Text of the previous and next buttons.
   * @defaultValue `Continue` and `Finish` for the last step
   */
  nextText?: string;
  /**
   * Custom buttons to be shown in the footer.
   */
  footerActions?: FooterActions;
  /**
   * The element to scroll to when the tooltip is shown.
   */
  scrollElement?: string;

  wait?: WaitStepOptions | WaitStepOptions[];
}
export interface FlowModalStep {
  /**
   * Optional key to identify the step. Useful for controlling the flow programmatically with `getCurrentStep()`.
   */
  key?: string;
  /**
   * Title of the modal. Supports HTML.
   */
  title: string;
  /**
   * Body of the modal. Supports HTML.
   */
  body?: string;
  /**
   * Hide the close button. Without the close button the user will not be able to close the tooltip.
   */
  hideClose?: boolean;
  /**
   * Hide the previous button. Without the previous button the user will not be able to go back.
   */
  hidePrev?: boolean;
  /**
   * Hide the next button.
   * This option should be used with `footerActions` to provide a way to go to the next step or by controlling the flow programmatically with `nextStep()`.
   */
  hideNext?: boolean;
  /**
   * Text of the previous and next buttons.
   * @defaultValue `Back`
   */
  prevText?: string;
  /**
   * Text of the previous and next buttons.
   * @defaultValue `Continue` and `Finish` for the last step
   */
  nextText?: string;
  /**
   * Custom buttons to be shown in the footer.
   */
  footerActions?: FooterActions;

  wait?: WaitStepOptions | WaitStepOptions[];
}
export interface WaitStepOptions {
  element?: string;
  form?: {
    element: string;
    values: {
      element: string;
      /**
       * Regex string to match the value against.
       */
      value: string;
    }[];
  };
  change?: {
    element: string;
    /**
     * Regex string to match the value against.
     */
    value: string;
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
  /**
   * Draft flow will not be shown to users.
   * Draft flows can be started by calling `startFlow()` with `startDraft` option.
   * @defaultValue `false`
   */
  draft?: boolean;
  /**
   * Flow is missing some steps that will be loaded asynchronously on start.
   * This is internal option for the Cloud SDK.
   * @defaultValue `false`
   */
  _incompleteSteps?: boolean;
}
