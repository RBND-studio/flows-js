import { log } from "../lib/log";
import type { EndFlowOptions, FlowStep, IdentifyUserOptions, StartFlowOptions } from "../types";
import { FlowState } from "./flow-state";
import { FlowsContext } from "./flows-context";
import { flowUserPropertyGroupMatch } from "./user-properties";

/**
 * Start a Flow.
 */
export const startFlow = (flowId: string, { again, startDraft }: StartFlowOptions = {}): void => {
  const warn = (message: string): void => {
    log.warn(`Failed to start "${flowId}": ${message}`);
  };

  if (!flowId) {
    warn("Missing flowId");
    return;
  }
  const instances = FlowsContext.getInstance().instances;
  if (instances.has(flowId)) {
    warn("Flow is already running");
    return;
  }

  const flow = FlowsContext.getInstance().flowsById?.[flowId];
  if (!flow) {
    warn("Missing Flow definition");
    return;
  }

  if (flow.draft && !startDraft) {
    warn("Flow is not published");
    return;
  }

  // If the flow is draft, we ignore targeting and frequency
  if (!flow.draft) {
    const flowFrequency = flow.frequency ?? "once";
    const flowSeen = FlowsContext.getInstance().seenFlows.find(
      (seenFlow) => seenFlow.flowId === flowId,
    );
    const frequencyMatch = (() => {
      if (again) return true;
      if (!flowSeen) return true;
      if (flowFrequency === "every-time") return true;
      if (
        flowFrequency === "every-session" &&
        flowSeen.sessionTime !== FlowsContext.getInstance().sessionTime.toISOString()
      )
        return true;

      return false;
    })();

    if (!frequencyMatch) {
      warn("User has already seen the Flow");
      return;
    }

    const userPropertiesMatch = flowUserPropertyGroupMatch(
      FlowsContext.getInstance().userProperties,
      flow.userProperties,
    );
    if (!userPropertiesMatch) {
      warn("User is not allowed to see the Flow");
      return;
    }
  }

  const state = new FlowState(flowId, FlowsContext.getInstance());
  FlowsContext.getInstance().addInstance(flowId, state);
  state.render();
};

/**
 * Stop a Flow.
 */
export const endFlow = (flowId: string, { variant = "cancel" }: EndFlowOptions = {}): void => {
  const instances = FlowsContext.getInstance().instances;
  const state = instances.get(flowId);
  if (!state) return;
  if (variant === "finish") state.finish();
  if (variant === "cancel") state.cancel();
  state.destroy();
};

/**
 * Identify a user. Works in the same way as user parameters in `init()`.
 */
export const identifyUser = (options: IdentifyUserOptions): void => {
  FlowsContext.getInstance().updateUser(options);
};

/**
 * Get the current step of a running Flow. Returns `null` if the Flow is not running.
 */
export const getCurrentStep = (flowId: string): FlowStep | null => {
  const state = FlowsContext.getInstance().instances.get(flowId);
  if (!state) return null;
  return state.currentStep ?? null;
};
/**
 * Go to the next step of a running Flow.
 */
export const nextStep = (flowId: string, targetBranch?: number): void => {
  const state = FlowsContext.getInstance().instances.get(flowId);
  if (!state) return;
  state.nextStep(targetBranch).render();
};
