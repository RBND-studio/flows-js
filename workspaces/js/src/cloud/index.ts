import { startFlow } from "../public-methods";
import { init as flowsInit } from "../init";
import type { DebugEvent, FlowsCloudOptions, TrackingEvent } from "../types";
import { hash } from "../utils";
import { log } from "../log";
import { validateFlowsOptions, validateCloudFlowsOptions } from "../validation";
import { api } from "./api";
import { loadStyle } from "./style";

export * from "../index";

export const init = async (options: FlowsCloudOptions): Promise<void> => {
  const cloudValidationResult = validateCloudFlowsOptions(options);
  const coreValidationResult = validateFlowsOptions(options);
  const validationResult = !cloudValidationResult.valid
    ? cloudValidationResult
    : coreValidationResult;
  if (validationResult.error)
    log.error(
      `Error validating options at: options.${validationResult.error.path.join(".")} with value:`,
      validationResult.error.value,
    );
  if (!validationResult.valid) return;

  const apiUrl = options.customApiUrl ?? "https://api.flows-cloud.com";

  loadStyle({ apiUrl, projectId: options.projectId });

  const flows = await api(apiUrl)
    .getFlows({
      projectId: options.projectId,
      userHash: options.userId ? await hash(options.userId) : undefined,
    })
    .catch((err) => {
      log.error(
        `Failed to load data from cloud for %c${options.projectId}%c, make sure projectId is correct and your project domains are correctly set up.\n`,
        "font-weight:bold",
        err,
      );
    });

  const saveEvent = async (
    event: DebugEvent | TrackingEvent,
  ): Promise<{ referenceId: string } | undefined> => {
    const { flowHash, flowId, type, projectId = "", stepIndex, stepHash, userId } = event;

    return api(apiUrl)
      .sendEvent({
        eventTime: new Date().toISOString(),
        flowHash,
        flowId,
        projectId,
        type,
        stepHash,
        stepIndex: stepIndex?.toString(),
        userHash: userId ? await hash(userId) : undefined,
      })
      .then((res) => ({ referenceId: res.id }))
      .catch((err) => {
        log.error("Failed to send event to cloud\n", err);
        return undefined;
      });
  };

  return flowsInit({
    ...options,
    flows: [...(options.flows ?? []), ...(flows || [])],
    tracking: (event) => {
      options.tracking?.(event);
      void saveEvent(event);
    },
    _debug: async (event) => {
      if (event.type === "invalidateTooltipError") {
        if (event.referenceId) void api(apiUrl).deleteEvent(event.referenceId);
      } else return saveEvent(event);
    },
    onLocationChange: (pathname, context) => {
      const params = new URLSearchParams(pathname.split("?")[1] ?? "");
      const flowId = params.get("flows-flow-id");
      const projectId = params.get("flows-project-id");
      if (!flowId || !projectId) return;

      void api(apiUrl)
        .getPreviewFlow({ flowId, projectId })
        .then((flow) => {
          context.addFlowData({ ...flow, draft: true });
          startFlow(flow.id, { startDraft: true });
        })
        .catch((err) => {
          log.error("Failed to load preview flow\n", err);
        });
    },
    onIncompleteFlowStart: (flowId, context) => {
      void api(apiUrl)
        .getFlowDetail({ flowId, projectId: options.projectId })
        .then((flow) => {
          context.addFlowData(flow);
        })
        .catch((err) => {
          log.error("Failed to load flow detail\n", err);
        });
    },
  });
};

// TODO: identifyUser should load flows according to the userHash
