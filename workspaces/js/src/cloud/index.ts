import { startFlow } from "../core/public-methods";
import { init as flowsInit } from "../core/init";
import type { FlowsCloudOptions, IdentifyUserOptions } from "../types";
import { log } from "../lib/log";
import { validateFlowsOptions, validateCloudFlowsOptions } from "../core/validation";
import { hash } from "../lib/hash";
import { api } from "./api";
import { loadStyle } from "./style";
import { saveEvent } from "./event";

export * from "../core/index";

let _options: FlowsCloudOptions | null = null;

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
  _options = options;

  const apiUrl = options.customApiUrl ?? "https://api.flows-cloud.com";

  loadStyle({ apiUrl, projectId: options.projectId });

  const flows = await api(apiUrl)
    .getFlows({
      projectId: options.projectId,
      userHash: options.userId ? await hash(options.userId) : undefined,
    })
    .catch((err) => {
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
      void saveEvent({ apiUrl, event });
    },
    _debug: async (event) => {
      if (event.type === "invalidateTooltipError") {
        if (event.referenceId) void api(apiUrl).deleteEvent(event.referenceId);
      } else return saveEvent({ event, apiUrl });
    },
    onLocationChange: (pathname, context) => {
      const params = new URLSearchParams(pathname.split("?")[1] ?? "");
      const flowId = params.get("flows-flow-id");
      const projectId = params.get("flows-project-id");
      if (!flowId || !projectId) return;

      void api(apiUrl)
        .getPreviewFlow({ flowId, projectId })
        .then((flow) => {
          context.addFlowData({ ...flow, draft: true }, { validate: false });
          startFlow(flow.id, { startDraft: true });
        })
        .catch((err) => {
          log.error("Failed to load preview flow", err);
        });
    },
    onIncompleteFlowStart: (flowId, context) => {
      void api(apiUrl)
        .getFlowDetail({ flowId, projectId: options.projectId })
        .then((flow) => {
          context.addFlowData(flow, { validate: false });
        })
        .catch((err) => {
          log.error("Failed to load flow detail", err);
        });
    },
  });
};

/**
 * Identify a user. Works in the same way as user parameters in `init()`.
 *
 * **Warning**: Use this method only if you don't have information about user at the time of calling `init()`.
 */
export const identifyUser = (options: IdentifyUserOptions): void => {
  if (!_options) {
    log.error("Cannot identify user before Flows are initialized.");
    return;
  }
  void init({ ..._options, ...options });
};
