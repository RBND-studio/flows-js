import type { Describe, StructError } from "superstruct";
import {
  array,
  boolean,
  number,
  optional,
  regexp,
  string,
  union,
  enums,
  type,
  func,
  assert,
  nullable,
  date,
} from "superstruct";
import type {
  FlowTooltipStep,
  FlowModalStep,
  WaitStepOptions,
  StepOption,
  FlowWaitStep,
  Flow,
  FlowsOptions,
  UserPropertyMatch,
  PrimitiveValue,
  CompareValue,
  UserPropertyMatchGroup,
} from "./types";

const WaitOptionsStruct: Describe<WaitStepOptions> = type({
  element: optional(string()),
  form: optional(
    type({
      element: string(),
      values: array(
        type({
          element: string(),
          value: string(),
        }),
      ),
    }),
  ),
  change: optional(
    array(
      type({
        element: string(),
        value: union([string(), regexp()]),
      }),
    ),
  ),
  action: optional(number()),
  location: optional(string()),
});

const StepOptionStruct: Describe<StepOption> = type({ text: string(), action: number() });

const TooltipStepStruct: Describe<FlowTooltipStep> = type({
  element: string(),
  title: string(),
  body: optional(string()),
  arrow: optional(boolean()),
  hideClose: optional(boolean()),
  key: optional(string()),
  options: optional(array(StepOptionStruct)),
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

const ModalStepStruct: Describe<FlowModalStep> = type({
  title: string(),
  body: optional(string()),
  key: optional(string()),
  options: optional(array(StepOptionStruct)),
  wait: optional(union([WaitOptionsStruct, array(WaitOptionsStruct)])),
});

const WaitStepStruct: Describe<FlowWaitStep> = type({
  key: optional(string()),
  wait: union([WaitOptionsStruct, array(WaitOptionsStruct)]) as unknown as Describe<
    WaitStepOptions | WaitStepOptions[]
  >,
});

const StepStruct = union([TooltipStepStruct, ModalStepStruct, WaitStepStruct]);

const FlowStepsStruct = array(union([StepStruct, array(array(StepStruct))]));

const PrimitiveValueStruct: Describe<PrimitiveValue> = optional(
  nullable(union([string(), number(), boolean()])),
);
const CompareValueStruct: Describe<CompareValue> = union([number(), date(), string()]);
const UserPropertyMatchStruct: Describe<UserPropertyMatch> = type({
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

const FlowStruct: Describe<Flow> = type({
  id: string(),
  frequency: optional(enums(["once", "every-time"])),
  location: optional(string()),
  element: optional(string()),
  steps: FlowStepsStruct,
  userProperties: optional(
    union([UserPropertyMatchGroupStruct, array(UserPropertyMatchGroupStruct)]),
  ),
});

const OptionsStruct: Describe<FlowsOptions> = type({
  flows: optional(array(FlowStruct)),
  onNextStep: optional(func()) as Describe<FlowsOptions["onNextStep"]>,
  onPrevStep: optional(func()) as Describe<FlowsOptions["onPrevStep"]>,
  tracking: optional(func()) as Describe<FlowsOptions["tracking"]>,
  userId: optional(string()),
  userProperties: optional(type({})) as unknown as Describe<FlowsOptions["userProperties"]>,
  seenFlowIds: optional(array(string())),
  onSeenFlowIdsChange: optional(func()) as Describe<FlowsOptions["onSeenFlowIdsChange"]>,
  rootElement: optional(string()),
  projectId: optional(string()),
  customApiUrl: optional(string()),
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

export const isValidFlow = (flow: unknown): flow is Flow => FlowStruct.is(flow);
export const validateFlow = validateStruct(FlowStruct);
