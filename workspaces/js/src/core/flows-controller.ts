import { log } from "../lib/log";
import {
  type FlowStep,
  type IdentifyUserOptions,
  type EndFlowOptions,
  type StartFlowOptions,
} from "../types";
import { FlowState } from "./flow-state";
import type { FlowsContext } from "./flows-context";
import { flowUserPropertyGroupMatch } from "./user-properties";

export class FlowsController {
  flowsContext: FlowsContext;

  constructor(context: FlowsContext) {
    this.flowsContext = context;
  }

  startFlow(flowId: string, { again, startDraft }: StartFlowOptions = {}): void {
    const warn = (message: string): void => {
      log.warn(`Failed to start "${flowId}": ${message}`);
    };

    if (!flowId) {
      warn("Missing flowId");
      return;
    }
    const instances = this.flowsContext.instances;
    if (instances.has(flowId)) {
      warn("Flow is already running");
      return;
    }

    const flow = this.flowsContext.flowsById?.[flowId];
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
      const flowSeen = this.flowsContext.seenFlows.find((seenFlow) => seenFlow.flowId === flowId);
      const frequencyMatch = (() => {
        if (again) return true;
        if (!flowSeen) return true;
        if (flowFrequency === "every-time") return true;
        return false;
      })();

      if (!frequencyMatch) {
        warn("User has already seen the Flow");
        return;
      }

      const userPropertiesMatch = flowUserPropertyGroupMatch(
        this.flowsContext.userProperties,
        flow.userProperties,
      );
      if (!userPropertiesMatch) {
        warn("User is not allowed to see the Flow");
        return;
      }
    }

    const state = new FlowState(flowId, this.flowsContext);
    this.flowsContext.addInstance(flowId, state);
    state.render();
  }

  endFlow(flowId: string, { variant = "cancel" }: EndFlowOptions = {}): void {
    const instances = this.flowsContext.instances;
    const state = instances.get(flowId);
    if (!state) return;
    if (variant === "finish") state.finish();
    if (variant === "cancel") state.cancel();
    state.destroy();
  }

  identifyUser = (options: IdentifyUserOptions): void => {
    this.flowsContext.updateUser(options);
  };

  getCurrentStep = (flowId: string): FlowStep | null => {
    const state = this.flowsContext.instances.get(flowId);
    if (!state) return null;
    return state.currentStep ?? null;
  };
  nextStep = (flowId: string, targetBranch?: number): void => {
    const state = this.flowsContext.instances.get(flowId);
    if (!state) return;
    state.nextStep(targetBranch).render();
  };
}
