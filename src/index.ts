import "./jsx";

import { FlowState } from "./flow-state";
import { FlowsContext } from "./flows-context";
import { changeWaitMatch, formWaitMatch } from "./form";
import { addHandlers } from "./handlers";
import type {
  Flow,
  FlowsOptions,
  TrackingEvent,
  FlowStep,
  StartFlowOptions,
  FlowsInitOptions,
} from "./types";

const instances = new Map<string, FlowState>();
let observer: MutationObserver | null = null;

export const startFlow = (flowId: string, { again }: StartFlowOptions = {}): void => {
  if (!again && FlowsContext.getInstance().seenFlowIds.includes(flowId)) return;
  if (instances.has(flowId)) return;
  const state = new FlowState({ flowId }, FlowsContext.getInstance());
  instances.set(flowId, state);
  state.render();
};

export const endFlow = (flowId: string): void => {
  const state = instances.get(flowId);
  if (!state) return;
  if (state.hasNextStep) state.finish();
  else state.cancel();
  instances.delete(flowId);
};

export const identifyUser = (userId: string): void => {
  FlowsContext.getInstance().userId = userId;
};

export const getCurrentStep = (flowId: string): FlowStep | null => {
  const state = instances.get(flowId);
  if (!state) return null;
  return state.currentStep ?? null;
};
export const nextStep = (flowId: string, action?: number): void => {
  const state = instances.get(flowId);
  if (!state) return;
  state.nextStep(action).render();
};

const _init = (options: FlowsInitOptions): void => {
  const context = FlowsContext.getInstance();
  context.updateFromOptions(options);

  const handleClick = (event: MouseEvent): void => {
    const eventTarget = event.target;
    if (!eventTarget || !(eventTarget instanceof Element)) return;

    if (
      Array.from(document.querySelectorAll(".flows-root")).some((root) =>
        root.contains(eventTarget),
      )
    ) {
      event.stopPropagation();
    }

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
      const flow = Array.from(instances.values()).find(
        (s) => s.flowElement?.element.contains(eventTarget),
      );
      flow?.prevStep().render();
    }
    if (eventTarget.matches(".flows-continue")) {
      const flow = Array.from(instances.values()).find(
        (s) => s.flowElement?.element.contains(eventTarget),
      );
      flow?.nextStep().render();
    }
    if (eventTarget.matches(".flows-option")) {
      const action = Number(eventTarget.getAttribute("data-action"));
      if (Number.isNaN(action)) return;
      const flow = Array.from(instances.values()).find(
        (s) => s.flowElement?.element.contains(eventTarget),
      );
      flow?.nextStep(action).render();
    }

    if (eventTarget.matches(".flows-finish")) {
      const flow = Array.from(instances.values()).find(
        (s) => s.flowElement?.element.contains(eventTarget),
      );
      if (flow) {
        flow.finish();
        instances.delete(flow.flowId);
      }
    }
    if (eventTarget.matches(".flows-cancel")) {
      const flow = Array.from(instances.values()).find(
        (s) => s.flowElement?.element.contains(eventTarget),
      );
      if (flow) {
        flow.cancel();
        instances.delete(flow.flowId);
      }
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
  const handlePointerDown = (event: PointerEvent): void => {
    const eventTarget = event.target;
    if (!eventTarget || !(eventTarget instanceof Element)) return;

    if (
      Array.from(document.querySelectorAll(".flows-root")).some((root) =>
        root.contains(eventTarget),
      )
    ) {
      event.stopPropagation();
    }
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
    { type: "pointerdown", handler: handlePointerDown },
  ]);
};

export const init: (options: FlowsOptions) => void = _init;
export type { FlowsOptions, Flow, TrackingEvent, FlowStep, StartFlowOptions };
