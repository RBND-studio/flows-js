import type { Describe, StructError } from "superstruct";
import {
  array,
  boolean,
  number,
  optional,
  string,
  union,
  enums,
  func,
  assert,
  nullable,
  date,
  object,
  type,
} from "superstruct";
import type {
  FlowTooltipStep,
  FlowModalStep,
  WaitStepOptions,
  FlowWaitStep,
  Flow,
  FlowsOptions,
  UserPropertyMatch,
  PrimitiveValue,
  CompareValue,
  UserPropertyMatchGroup,
  FlowsInitOptions,
  FlowsCloudOptions,
  FooterActions,
  FooterActionItem,
} from "./types";

const WaitOptionsStruct: Describe<WaitStepOptions> = object({
  element: optional(string()),
  form: optional(
    object({
      element: string(),
      values: array(
        object({
          element: string(),
          value: string(),
        }),
      ),
    }),
  ),
  change: optional(
    array(
      object({
        element: string(),
        value: string(),
      }),
    ),
  ),
  action: optional(number()),
  location: optional(string()),
});

const FooterActionItemStruct: Describe<FooterActionItem> = object({
  text: string(),
  action: optional(number()),
  href: optional(string()),
  external: optional(boolean()),
  next: optional(boolean()),
  prev: optional(boolean()),
});
const FooterActionsStruct: Describe<FooterActions> = object({
  center: optional(array(FooterActionItemStruct)),
  left: optional(array(FooterActionItemStruct)),
  right: optional(array(FooterActionItemStruct)),
});

const TooltipStepStruct: Describe<FlowTooltipStep> = object({
  element: string(),
  title: string(),
  body: optional(string()),
  hideArrow: optional(boolean()),
  hideClose: optional(boolean()),
  hidePrev: optional(boolean()),
  hideNext: optional(boolean()),
  prevText: optional(string()),
  nextText: optional(string()),
  key: optional(string()),
  footerActions: optional(FooterActionsStruct),
  placement: optional(
    enums([
      "top",
      "right",
      "bottom",
      "left",
      "top-start",
      "top-end",
      "right-start",
      "right-end",
      "bottom-start",
      "bottom-end",
      "left-start",
      "left-end",
    ]),
  ),
  scrollElement: optional(string()),
  wait: optional(union([WaitOptionsStruct, array(WaitOptionsStruct)])),
});

const ModalStepStruct: Describe<FlowModalStep> = object({
  title: string(),
  body: optional(string()),
  key: optional(string()),
  hideClose: optional(boolean()),
  hidePrev: optional(boolean()),
  hideNext: optional(boolean()),
  prevText: optional(string()),
  nextText: optional(string()),
  footerActions: optional(FooterActionsStruct),
  wait: optional(union([WaitOptionsStruct, array(WaitOptionsStruct)])),
});

const WaitStepStruct: Describe<FlowWaitStep> = object({
  key: optional(string()),
  wait: union([WaitOptionsStruct, array(WaitOptionsStruct)]) as unknown as Describe<
    WaitStepOptions | WaitStepOptions[]
  >,
});

const StepStruct = union([TooltipStepStruct, ModalStepStruct, WaitStepStruct]);

const FlowStepsStruct = array(union([StepStruct, array(array(StepStruct))]));

const PrimitiveValueStruct: Describe<PrimitiveValue> = nullable(
  union([string(), number(), boolean()]),
);
const CompareValueStruct: Describe<CompareValue> = union([number(), date(), string()]);
const UserPropertyMatchStruct: Describe<UserPropertyMatch> = object({
  key: string(),
  regex: optional(string()),
  eq: optional(union([PrimitiveValueStruct, array(PrimitiveValueStruct)])),
  ne: optional(union([PrimitiveValueStruct, array(PrimitiveValueStruct)])),
  gt: optional(CompareValueStruct),
  gte: optional(CompareValueStruct),
  lt: optional(CompareValueStruct),
  lte: optional(CompareValueStruct),
  contains: optional(union([string(), array(string())])),
  notContains: optional(union([string(), array(string())])),
});
const UserPropertyMatchGroupStruct: Describe<UserPropertyMatchGroup> =
  array(UserPropertyMatchStruct);

const FlowStruct: Describe<Flow> = object({
  id: string(),
  frequency: optional(enums(["once", "every-time"])),
  location: optional(string()),
  element: optional(string()),
  steps: FlowStepsStruct,
  userProperties: optional(
    union([UserPropertyMatchGroupStruct, array(UserPropertyMatchGroupStruct)]),
  ),
  draft: optional(boolean()),
  _incompleteSteps: optional(boolean()),
});

const OptionsStruct: Describe<FlowsInitOptions> = type({
  flows: optional(array(FlowStruct)),
  onNextStep: optional(func()) as Describe<FlowsInitOptions["onNextStep"]>,
  onPrevStep: optional(func()) as Describe<FlowsInitOptions["onPrevStep"]>,
  tracking: optional(func()) as Describe<FlowsInitOptions["tracking"]>,
  userId: optional(string()),
  userProperties: optional(type({})) as unknown as Describe<FlowsInitOptions["userProperties"]>,
  seenFlowIds: optional(array(string())),
  onSeenFlowIdsChange: optional(func()) as Describe<FlowsInitOptions["onSeenFlowIdsChange"]>,
  rootElement: optional(string()),
  projectId: optional(string()),
  customApiUrl: optional(string()),
  onLocationChange: optional(func()) as Describe<FlowsInitOptions["onLocationChange"]>,
  onIncompleteFlowStart: optional(func()) as Describe<FlowsInitOptions["onIncompleteFlowStart"]>,
});
const CloudOptionsStruct: Describe<
  Omit<FlowsCloudOptions, keyof Omit<FlowsInitOptions, "projectId">>
> = type({
  customApiUrl: optional(string()),
  projectId: string(),
});

const validateStruct =
  <T>(struct: Describe<T>) =>
  (value: unknown) => {
    try {
      assert(value, struct);
      return { valid: true };
    } catch (e) {
      const error = e as StructError;
      return { error, valid: false };
    }
  };

export const isValidFlowsOptions = (options: unknown): options is FlowsOptions =>
  OptionsStruct.is(options);
export const validateFlowsOptions = validateStruct(OptionsStruct);
export const validateCloudFlowsOptions = validateStruct(CloudOptionsStruct);

export const isValidFlow = (flow: unknown): flow is Flow => FlowStruct.is(flow);
export const validateFlow = validateStruct(FlowStruct);
