import { getPathname, parsePreviewFlowId } from "../lib/location";
import { endFlow, startFlow } from "./public-methods";
import { FlowsContext } from "./flows-context";
import { getWaitMatchingByLocation } from "./wait";
import { PreviewPanel } from "./preview-panel";

// We're not setting default to avoid accessing window on the server
let prevPathname: string | null = null;

export const handleLocationChange = (): void => {
  const pathname = getPathname();
  const locationChanged = prevPathname !== null && prevPathname !== pathname;
  prevPathname = pathname;

  if (!locationChanged) return;
  FlowsContext.getInstance().onLocationChange?.(pathname, FlowsContext.getInstance());

  FlowsContext.getInstance().instances.forEach((state) => {
    const step = state.currentStep;
    if (!step) return;
    if ("targetElement" in step && step.targetElement) {
      const el = document.querySelector(step.targetElement);
      if (!el) endFlow(state.flowId, { variant: "cancel" });
    }

    if (step.wait) {
      const matchingWait = getWaitMatchingByLocation({ wait: step.wait, pathname });
      if (matchingWait) state.nextStep(matchingWait.targetBranch).render();
    }
  });

  showPreviewPanel(pathname);

  startFlowsBasedOnLocation(pathname);
};

const startFlowsBasedOnLocation = (pathname: string): void => {
  Object.values(FlowsContext.getInstance().flowsById ?? {}).forEach((flow) => {
    if (!flow.start) return;
    const matchingWait = getWaitMatchingByLocation({ wait: flow.start, pathname });
    if (matchingWait) startFlow(flow.id);
  });
};

const showPreviewPanel = (pathname: string): void => {
  const preview = parsePreviewFlowId(pathname);
  if (preview) {
    const { flowId } = preview;
    const context = FlowsContext.getInstance();
    context.previewPanel = new PreviewPanel({ context, flowId });
  }
};

export const simulateLocationChangeAfterInit = (): void => {
  const pathname = getPathname();
  showPreviewPanel(pathname);
  startFlowsBasedOnLocation(pathname);
};
