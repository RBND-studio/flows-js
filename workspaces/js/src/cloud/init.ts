import { endFlow, startFlow } from "../core/public-methods";
import { init as flowsInit } from "../core/init";
import type { FlowsCloudOptions } from "../types";
import { log } from "../lib/log";
import { validateFlowsOptions, validateCloudFlowsOptions } from "../core/validation";
import { hash } from "../lib/hash";
import { getPathname, parsePreviewFlowId } from "../lib/location";
import { getPersistentState } from "../lib/persistent-state";
import { api } from "./api";
import { loadStyle } from "./style";
import { saveEvent } from "./event";
import { FlowsCloudContext } from "./options";

/**
 * Initialize Flows SDK. This will load Flows and CSS template from the Cloud.
 *
 * **Warning**: This method should be called only once. Calling it multiple times will result in unnecessary network requests.
 */
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
  FlowsCloudContext.getInstance().options = options;

  loadStyle(options.projectId);

  const previewParams = parsePreviewFlowId(getPathname());
  const persistentState = getPersistentState();
  const previewFlowId =
    previewParams?.flowId ?? persistentState.runningFlows.find((f) => f.draft)?.flowId;

  const flows = await api
    .getFlows({
      projectId: options.projectId,
      userHash: options.userId ? await hash(options.userId) : undefined,
    })
    .then((res) => {
      if (res.error_message) log.error(res.error_message);
      // If previewing a flow, filter it out so we load draft version instead
      if (previewFlowId) return res.results.filter((flow) => flow.id !== previewFlowId);
      return res.results;
    })
    .catch((err: unknown) => {
      log.error(
        `Failed to load data from cloud for %c${options.projectId}%c, make sure projectId is correct and your project domains are correctly set up.`,
        "font-weight:bold",
        err,
      );
    });

  return flowsInit({
    ...options,
    validate: false,
    flows: [...(options.flows ?? []), ...(flows || [])],
    tracking: (event) => {
      options.tracking?.(event);
      void saveEvent(event);
    },
    _debug: async (event) => {
      if (event.type === "invalidateTooltipError") {
        if (event.referenceId) void api.deleteEvent(event.referenceId);
      } else return saveEvent(event);
    },
    onLocationChange: (pathname, context) => {
      const result = parsePreviewFlowId(pathname);
      if (!result) return;
      const { flowId } = result;

      const flowRunning = context.instances.has(flowId);
      if (flowRunning) return;

      void api
        .getPreviewFlow({ flowId, projectId: options.projectId })
        .then((flow) => {
          endFlow(flowId, { variant: "no-event" });
          context.addFlowData({ ...flow, draft: true }, { validate: false });
          startFlow(flow.id, { startDraft: true });
        })
        .catch((err: unknown) => {
          log.error("Failed to load preview flow", err);
        });
    },
    onIncompleteFlowStart: (flowId, context) => {
      void api
        .getFlowDetail({ flowId, projectId: options.projectId })
        .then((flow) => {
          context.addFlowData(flow, { validate: false });
        })
        .catch((err: unknown) => {
          log.error("Failed to load flow detail", err);
        });
    },
    loadFlow: (flowId, { draft } = {}) => {
      const fetchFn = draft ? api.getPreviewFlow : api.getFlowDetail;
      return fetchFn({ flowId, projectId: options.projectId }).catch((err: unknown) => {
        log.error("Failed to load flow detail", err);
        return undefined;
      });
    },
  });
};
