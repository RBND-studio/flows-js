import { FlowState } from "./flow-state";
import type { Flow, FlowsContext, FlowsOptions } from "./types";
import "./react";

let instances: FlowState[] = [];
const context: FlowsContext = {};

export const startFlow = (flowId: string): void => {
  const state = new FlowState({ flowId }, context);
  instances.push(state);
  state.render();
};

export const init = (options: FlowsOptions): void => {
  context.customerId = options.customerId;
  context.flowsById = options.flows?.reduce(
    (acc, flow) => {
      acc[flow.id] = flow;
      return acc;
    },
    {} as Record<string, Flow>,
  );

  document.addEventListener("click", (event) => {
    const eventTarget = event.target;
    if (!eventTarget || !(eventTarget instanceof Element)) return;

    Object.values(context.flowsById ?? {}).forEach((flow) => {
      if (instances.some((state) => state.flowId === flow.id)) return;
      if (eventTarget.matches(flow.element)) startFlow(flow.id);
    });

    if (eventTarget.matches(".flows-continue")) {
      const flow = instances.find((state) => state.flowElement?.element.contains(eventTarget));
      if (!flow) return;
      flow.nextStep().render();
    }
    if (eventTarget.matches(".flows-finish")) {
      instances = instances.filter((state) => {
        if (!state.flowElement?.element.contains(eventTarget)) return true;
        state.cleanup();
        return false;
      });
    }
  });

  // eslint-disable-next-line no-console -- this is a demo
  console.log("You initialized FlowsJS", options);
};
