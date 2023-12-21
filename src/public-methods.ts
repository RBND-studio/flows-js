import { FlowState } from "./flow-state";
import { FlowsContext } from "./flows-context";
import type { EndFlowOptions, FlowStep, IdentifyUserOptions, StartFlowOptions } from "./types";
import { flowUserPropertyGroupMatch } from "./user-properties";

export const startFlow = (flowId: string, { again, startDraft }: StartFlowOptions = {}): void => {
  const instances = FlowsContext.getInstance().instances;
  if (instances.has(flowId)) return;

  const flow = FlowsContext.getInstance().flowsById?.[flowId];
  if (!flow) return;

  if (flow.draft && !startDraft) return;

  // If the flow is draft, we ignore targeting and frequency
  if (!flow.draft) {
    const flowFrequency = flow.frequency ?? "once";
    const flowSeen = FlowsContext.getInstance().seenFlowIds.includes(flowId);
    const frequencyMatch = !flowSeen || flowFrequency === "every-time" || again;
    if (!frequencyMatch) return;

    const userPropertiesMatch = flowUserPropertyGroupMatch(
      FlowsContext.getInstance().userProperties,
      flow.userProperties,
    );
    if (!userPropertiesMatch) return;
  }

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

export const identifyUser = (userId: string, options?: IdentifyUserOptions): void => {
  FlowsContext.getInstance().userId = userId;
  FlowsContext.getInstance().userProperties = options?.properties;
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
