import { handleDocumentChange } from "./document-change";
import { FlowsContext } from "./flows-context";
import { changeWaitMatch, formWaitMatch } from "./form";
import { addHandlers } from "./handlers";
import { ready } from "./lib/ready";
import { log } from "./log";
import { endFlow, startFlow } from "./public-methods";
import type { FlowsInitOptions } from "./types";
import { validateFlowsOptions } from "./validation";

let observer: MutationObserver | null = null;

export const init = (options: FlowsInitOptions): Promise<void> =>
  new Promise((res) => {
    ready(() => {
      _init(options);
      res();
    });
  });

const _init = (options: FlowsInitOptions): void => {
  const validationResult = validateFlowsOptions(options);
  if (validationResult.error)
    log.error(
      `Error validating options at: options.${validationResult.error.path.join(".")} with value:`,
      validationResult.error.value,
    );
  if (!validationResult.valid) return;

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

    FlowsContext.getInstance().instances.forEach((state) => {
      const step = state.currentStep;
      if (!step?.wait) return;
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
      const flow = Array.from(FlowsContext.getInstance().instances.values()).find(
        (s) => s.flowElement?.element.contains(eventTarget),
      );
      flow?.prevStep().render();
    }
    if (eventTarget.matches(".flows-continue")) {
      const flow = Array.from(FlowsContext.getInstance().instances.values()).find(
        (s) => s.flowElement?.element.contains(eventTarget),
      );
      flow?.nextStep().render();
    }
    if (eventTarget.matches(".flows-option")) {
      const action = Number(eventTarget.getAttribute("data-action"));
      if (Number.isNaN(action)) return;
      const flow = Array.from(FlowsContext.getInstance().instances.values()).find(
        (s) => s.flowElement?.element.contains(eventTarget),
      );
      flow?.nextStep(action).render();
    }

    if (eventTarget.matches(".flows-finish")) {
      const flow = Array.from(FlowsContext.getInstance().instances.values()).find(
        (s) => s.flowElement?.element.contains(eventTarget),
      );
      if (flow) {
        endFlow(flow.flowId, { variant: "finish" });
      }
    }
    if (eventTarget.matches(".flows-cancel")) {
      const flow = Array.from(FlowsContext.getInstance().instances.values()).find(
        (s) => s.flowElement?.element.contains(eventTarget),
      );
      if (flow) {
        endFlow(flow.flowId, { variant: "cancel" });
      }
    }
  };
  const handleSubmit = (event: SubmitEvent): void => {
    const eventTarget = event.target;
    if (!eventTarget || !(eventTarget instanceof Element)) return;

    FlowsContext.getInstance().instances.forEach((state) => {
      const step = state.currentStep;
      if (!step?.wait) return;
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

    FlowsContext.getInstance().instances.forEach((state) => {
      const step = state.currentStep;
      if (!step?.wait) return;
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
  observer = new MutationObserver(handleDocumentChange);
  observer.observe(document, {
    subtree: true,
    attributes: true,
    childList: true,
  });

  addHandlers([
    { type: "click", handler: handleClick },
    { type: "submit", handler: handleSubmit },
    { type: "change", handler: handleChange },
    { type: "pointerdown", handler: handlePointerDown },
  ]);

  handleDocumentChange();
};
