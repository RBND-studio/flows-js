import { getPathname } from "../lib/location";
import { ready } from "../lib/ready";
import { log } from "../lib/log";
import type { FlowsInitOptions } from "../types";
import { handleDocumentChange } from "./document-change";
import { addHandlers } from "./handlers";
import { handleLocationChange, startFlowsBasedOnLocation } from "./location-change";
import { endFlow, startFlow } from "./public-methods";
import { validateFlowsOptions } from "./validation";
import { changeWaitMatch, formWaitMatch, locationMatch } from "./form";
import { FlowsContext } from "./flows-context";

let observer: MutationObserver | null = null;
let locationChangeInterval: number | null = null;

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
      const waitOptions = Array.isArray(step.wait) ? step.wait : [step.wait];
      const matchingWait = waitOptions.find((wait) => {
        if (!wait.clickElement) return false;
        const clickMatch = eventTarget.matches(wait.clickElement);
        const locMatch = wait.location
          ? locationMatch({ location: wait.location, pathname: getPathname() })
          : true;
        return clickMatch && locMatch;
      });
      if (matchingWait) state.nextStep(matchingWait.targetBranch).render();
    });

    if (eventTarget.matches(".flows-back")) {
      const flow = Array.from(FlowsContext.getInstance().instances.values()).find((s) =>
        s.flowElement?.element.contains(eventTarget),
      );
      flow?.prevStep().render();
    }
    if (eventTarget.matches(".flows-continue")) {
      const flow = Array.from(FlowsContext.getInstance().instances.values()).find((s) =>
        s.flowElement?.element.contains(eventTarget),
      );
      flow?.nextStep().render();
    }
    if (eventTarget.matches(".flows-option")) {
      const action = Number(eventTarget.getAttribute("data-action"));
      if (Number.isNaN(action)) return;
      const flow = Array.from(FlowsContext.getInstance().instances.values()).find((s) =>
        s.flowElement?.element.contains(eventTarget),
      );
      flow?.nextStep(action).render();
    }

    if (eventTarget.matches(".flows-finish")) {
      const flow = Array.from(FlowsContext.getInstance().instances.values()).find((s) =>
        s.flowElement?.element.contains(eventTarget),
      );
      if (flow) {
        endFlow(flow.flowId, { variant: "finish" });
      }
    }
    if (eventTarget.matches(".flows-cancel") || eventTarget.matches(".flows-overlay-cancel")) {
      const flow = Array.from(FlowsContext.getInstance().instances.values()).find((s) =>
        s.flowElement?.element.contains(eventTarget),
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
      const waitOptions = Array.isArray(step.wait) ? step.wait : [step.wait];
      const matchingWait = waitOptions.find((wait) => {
        const formMatch = formWaitMatch({ form: eventTarget, wait });
        const locMatch = wait.location
          ? locationMatch({ location: wait.location, pathname: getPathname() })
          : true;
        return formMatch && locMatch;
      });
      if (matchingWait) state.nextStep(matchingWait.targetBranch).render();
    });
  };
  const handleChange = (event: Event): void => {
    const eventTarget = event.target;
    if (!eventTarget || !(eventTarget instanceof Element)) return;

    FlowsContext.getInstance().instances.forEach((state) => {
      const step = state.currentStep;
      if (!step?.wait) return;
      const waitOptions = Array.isArray(step.wait) ? step.wait : [step.wait];
      const matchingWait = waitOptions.find((wait) => {
        const changeMatch = changeWaitMatch({ target: eventTarget, wait });
        const locMatch = wait.location
          ? locationMatch({ location: wait.location, pathname: getPathname() })
          : true;
        return changeMatch && locMatch;
      });
      if (matchingWait) state.nextStep(matchingWait.targetBranch).render();
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

  if (locationChangeInterval !== null) clearInterval(locationChangeInterval);
  locationChangeInterval = window.setInterval(() => {
    handleLocationChange();
  }, 50);

  addHandlers([
    { type: "click", handler: handleClick },
    { type: "submit", handler: handleSubmit },
    { type: "input", handler: handleChange },
    { type: "pointerdown", handler: handlePointerDown },
  ]);

  startFlowsBasedOnLocation();
};
