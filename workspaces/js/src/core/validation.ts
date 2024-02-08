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
  SeenFlow,
} from "../types";

const WaitOptionsStruct: Describe<WaitStepOptions> = object({
  clickElement: optional(string()),
  form: optional(
    object({
      formElement: string(),
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
  targetBranch: optional(number()),
  location: optional(string()),
});

const FooterActionItemStruct: Describe<FooterActionItem> = object({
  label: string(),
  targetBranch: optional(number()),
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
  targetElement: string(),
  title: string(),
  body: optional(string()),
  hideArrow: optional(boolean()),
  hideClose: optional(boolean()),
  hidePrev: optional(boolean()),
  hideNext: optional(boolean()),
  prevLabel: optional(string()),
  nextLabel: optional(string()),
  stepId: optional(string()),
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
  overlay: optional(boolean()),
  closeOnOverlayClick: optional(boolean()),
  scrollElement: optional(string()),
  wait: optional(union([WaitOptionsStruct, array(WaitOptionsStruct)])),
});

const ModalStepStruct: Describe<FlowModalStep> = object({
  title: string(),
  body: optional(string()),
  stepId: optional(string()),
  hideClose: optional(boolean()),
  hidePrev: optional(boolean()),
  hideNext: optional(boolean()),
  prevLabel: optional(string()),
  nextLabel: optional(string()),
  footerActions: optional(FooterActionsStruct),
  wait: optional(union([WaitOptionsStruct, array(WaitOptionsStruct)])),
});

const WaitStepStruct: Describe<FlowWaitStep> = object({
  stepId: optional(string()),
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
  clickElement: optional(string()),
  steps: FlowStepsStruct,
  userProperties: optional(
    union([UserPropertyMatchGroupStruct, array(UserPropertyMatchGroupStruct)]),
  ),
  draft: optional(boolean()),
  _incompleteSteps: optional(boolean()),
});

const SeenFlowStruct: Describe<SeenFlow> = object({
  flowId: string(),
  seenAt: string(),
});
const OptionsStruct: Describe<FlowsInitOptions> = type({
  flows: optional(array(FlowStruct)),
  onNextStep: optional(func()) as Describe<FlowsInitOptions["onNextStep"]>,
  onPrevStep: optional(func()) as Describe<FlowsInitOptions["onPrevStep"]>,
  tracking: optional(func()) as Describe<FlowsInitOptions["tracking"]>,
  _debug: optional(func()) as Describe<FlowsInitOptions["_debug"]>,
  userId: optional(string()),
  userProperties: optional(type({})) as unknown as Describe<FlowsInitOptions["userProperties"]>,
  seenFlows: optional(array(SeenFlowStruct)),
  onSeenFlowsChange: optional(func()) as Describe<FlowsInitOptions["onSeenFlowsChange"]>,
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
