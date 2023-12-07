import { FlowState } from "./flow-state";
import { FlowsContext } from "./flows-context";
import type { EndFlowOptions, FlowStep, StartFlowOptions } from "./types";

export const startFlow = (flowId: string, { again }: StartFlowOptions = {}): void => {
  const instances = FlowsContext.getInstance().instances;
  const flow = FlowsContext.getInstance().flowsById?.[flowId];
  const flowFrequency = flow?.frequency ?? "once";
  if (!again && FlowsContext.getInstance().seenFlowIds.includes(flowId) && flowFrequency === "once")
    return;
  if (instances.has(flowId)) return;
  const state = new FlowState({ flowId }, FlowsContext.getInstance());
  instances.set(flowId, state);
  state.render();
};

export const endFlow = (flowId: string, { variant = "cancel" }: EndFlowOptions = {}): void => {
  const instances = FlowsContext.getInstance().instances;
  const state = instances.get(flowId);
  if (!state) return;
  if (variant === "finish") state.finish();
  else state.cancel();
  instances.delete(flowId);
};

export const identifyUser = (userId: string): void => {
  FlowsContext.getInstance().userId = userId;
};

export const getCurrentStep = (flowId: string): FlowStep | null => {
  const state = FlowsContext.getInstance().instances.get(flowId);
  if (!state) return null;
  return state.currentStep ?? null;
};
export const nextStep = (flowId: string, action?: number): void => {
  const state = FlowsContext.getInstance().instances.get(flowId);
  if (!state) return;
  state.nextStep(action).render();
};
