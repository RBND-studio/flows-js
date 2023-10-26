import { FlowState } from "./flow-state";
import { changeWaitMatch, formWaitMatch } from "./form";
import { addHandlers } from "./handlers";
import "./jsx";
import type { Flow, FlowsContext, FlowsOptions, TrackingEvent, FlowStep } from "./types";

let instances: FlowState[] = [];
const context: FlowsContext = {};
let observer: MutationObserver | null = null;

export const startFlow = (flowId: string): void => {
  if (instances.some((state) => state.flowId === flowId)) return;
  const state = new FlowState({ flowId }, context);
  instances.push(state);
  state.render();
};

export const identifyUser = (userId: string): void => {
  context.userId = userId;
};

export const getCurrentStep = (flowId: string): FlowStep | null => {
  const state = instances.find((s) => s.flowId === flowId);
  if (!state) return null;
  return state.currentStep ?? null;
};
export const nextStep = (flowId: string, action?: number): void => {
  const state = instances.find((s) => s.flowId === flowId);
  if (!state) return;
  state.nextStep(action).render();
};

export const init = (options: FlowsOptions): void => {
  context.customerId = options.customerId;
  context.onNextStep = options.onNextStep;
  context.onPrevStep = options.onPrevStep;
  context.tracking = options.tracking;
  context.flowsById = options.flows?.reduce(
    (acc, flow) => {
      acc[flow.id] = flow;
      return acc;
    },
    {} as Record<string, Flow>,
  );

  const handleClick = (event: MouseEvent): void => {
    const eventTarget = event.target;
    if (!eventTarget || !(eventTarget instanceof Element)) return;

    Object.values(context.flowsById ?? {}).forEach((flow) => {
      if (!flow.element) return;
      if (eventTarget.matches(flow.element)) startFlow(flow.id);
    });

    instances.forEach((state) => {
      const step = state.currentStep;
      if (!step || !("wait" in step)) return;
      if (Array.isArray(step.wait)) {
        const matchingWait = step.wait.find((wait) => {
          if (wait.element) return eventTarget.matches(wait.element);
          return false;
        });
        if (matchingWait) state.nextStep(matchingWait.action).render();
      } else if (step.wait.element && eventTarget.matches(step.wait.element)) {
        state.nextStep().render();
      }
    });

    if (eventTarget.matches(".flows-back")) {
      const flow = instances.find((state) => state.flowElement?.element.contains(eventTarget));
      if (!flow) return;
      flow.prevStep().render();
    }
    if (eventTarget.matches(".flows-continue")) {
      const flow = instances.find((state) => state.flowElement?.element.contains(eventTarget));
      if (!flow) return;
      flow.nextStep().render();
    }
    if (eventTarget.matches(".flows-option")) {
      const action = Number(eventTarget.getAttribute("data-action"));
      if (Number.isNaN(action)) return;
      const flow = instances.find((state) => state.flowElement?.element.contains(eventTarget));
      if (!flow) return;
      flow.nextStep(action).render();
    }

    if (eventTarget.matches(".flows-finish")) {
      instances = instances.filter((state) => {
        if (!state.flowElement?.element.contains(eventTarget)) return true;
        state.finish();
        return false;
      });
    }
    if (eventTarget.matches(".flows-cancel")) {
      instances = instances.filter((state) => {
        if (!state.flowElement?.element.contains(eventTarget)) return true;
        state.cancel();
        return false;
      });
    }
  };
  const handleSubmit = (event: SubmitEvent): void => {
    const eventTarget = event.target;
    if (!eventTarget || !(eventTarget instanceof Element)) return;

    instances.forEach((state) => {
      const step = state.currentStep;
      if (!step || !("wait" in step)) return;
      if (Array.isArray(step.wait)) {
        const matchingWait = step.wait.find((wait) => formWaitMatch({ form: eventTarget, wait }));
        if (matchingWait) state.nextStep(matchingWait.action).render();
      } else if (formWaitMatch({ form: eventTarget, wait: step.wait })) {
        state.nextStep().render();
      }
    });
  };
  const handleChange = (event: Event): void => {
    const eventTarget = event.target;
    if (!eventTarget || !(eventTarget instanceof Element)) return;

    instances.forEach((state) => {
      const step = state.currentStep;
      if (!step || !("wait" in step)) return;
      if (Array.isArray(step.wait)) {
        const matchingWait = step.wait.find((wait) =>
          changeWaitMatch({ target: eventTarget, wait }),
        );
        if (matchingWait) state.nextStep(matchingWait.action).render();
      } else if (changeWaitMatch({ target: eventTarget, wait: step.wait })) {
        state.nextStep().render();
      }
    });
  };

  observer?.disconnect();
  observer = new MutationObserver(() => {
    instances.forEach((state) => {
      if (state.waitingForElement) state.render();
    });
  });
  observer.observe(document, {
    subtree: true,
    attributes: true,
  });

  addHandlers([
    { type: "click", handler: handleClick },
    { type: "submit", handler: handleSubmit },
    { type: "change", handler: handleChange },
  ]);
};

export type { FlowsOptions, Flow, TrackingEvent, FlowStep };
