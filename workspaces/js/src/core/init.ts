import { getPathname } from "../lib/location";
import { ready } from "../lib/ready";
import { log } from "../lib/log";
import type { FlowsInitOptions } from "../types";
import { handleDocumentChange } from "./document-change";
import { addHandlers } from "./handlers";
import { handleLocationChange, startFlowsBasedOnLocation } from "./location-change";
import { endFlow, startFlow } from "./public-methods";
import { validateFlowsOptions } from "./validation";
import { FlowsContext } from "./flows-context";
import { getWaitMatchingByChange, getWaitMatchingByClick, getWaitMatchingBySubmit } from "./wait";

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
  const validate = options.validate ?? true;
  if (validate) {
    const validationResult = validateFlowsOptions(options);
    if (validationResult.error)
      log.error(
        `Error validating options at: options.${validationResult.error.path.join(".")} with value:`,
        validationResult.error.value,
      );
    if (!validationResult.valid) return;
  }

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
      if (!flow.start) return;
      const matchingWait = getWaitMatchingByClick({ wait: flow.start, eventTarget });
      if (matchingWait) startFlow(flow.id);
    });

    FlowsContext.getInstance().instances.forEach((state) => {
      const step = state.currentStep;
      if (!step?.wait) return;
      const matchingWait = getWaitMatchingByClick({ wait: step.wait, eventTarget });
      if (matchingWait) state.nextStep(matchingWait.targetBranch).render();
    });

    if (eventTarget.matches(".flows-prev")) {
      const flow = Array.from(FlowsContext.getInstance().instances.values()).find((s) =>
        s.flowElement?.element.contains(eventTarget),
      );
      flow?.prevStep().render();
    }
    if (eventTarget.matches(".flows-next")) {
      const flow = Array.from(FlowsContext.getInstance().instances.values()).find((s) =>
        s.flowElement?.element.contains(eventTarget),
      );
      flow?.nextStep().render();
    }
    if (eventTarget.matches(".flows-action")) {
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

    Object.values(context.flowsById ?? {}).forEach((flow) => {
      if (!flow.start) return;
      const matchingWait = getWaitMatchingBySubmit({ wait: flow.start, eventTarget });
      if (matchingWait) startFlow(flow.id);
    });

    FlowsContext.getInstance().instances.forEach((state) => {
      const step = state.currentStep;
      if (!step?.wait) return;
      const matchingWait = getWaitMatchingBySubmit({ eventTarget, wait: step.wait });
      if (matchingWait) state.nextStep(matchingWait.targetBranch).render();
    });
  };
  const handleChange = (event: Event): void => {
    const eventTarget = event.target;
    if (!eventTarget || !(eventTarget instanceof Element)) return;

    Object.values(context.flowsById ?? {}).forEach((flow) => {
      if (!flow.start) return;
      const matchingWait = getWaitMatchingByChange({ wait: flow.start, eventTarget });
      if (matchingWait) startFlow(flow.id);
    });

    FlowsContext.getInstance().instances.forEach((state) => {
      const step = state.currentStep;
      if (!step?.wait) return;
      const matchingWait = getWaitMatchingByChange({ eventTarget, wait: step.wait });
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
  }, 250);

  addHandlers([
    { type: "click", handler: handleClick },
    { type: "submit", handler: handleSubmit },
    { type: "input", handler: handleChange },
    { type: "pointerdown", handler: handlePointerDown },
  ]);

  startFlowsBasedOnLocation();
  FlowsContext.getInstance().onLocationChange?.(getPathname(), FlowsContext.getInstance());
};
