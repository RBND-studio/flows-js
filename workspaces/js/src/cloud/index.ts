import { startFlow } from "../public-methods";
import { init as flowsInit } from "../init";
import type { FlowsCloudOptions } from "../types";
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

  return flowsInit({
    ...options,
    flows: [...(options.flows ?? []), ...(flows || [])],
    tracking: (event) => {
      options.tracking?.(event);

      const { flowHash, flowId, type, projectId = "", stepIndex, stepHash, userId } = event;

      void (async () =>
        api(apiUrl)
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
          .catch((err) => {
            log.error("Failed to send event to cloud\n", err);
          }))();
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
          context.addFlowData({ ...flow, draft: true });
        })
        .catch((err) => {
          log.error("Failed to load flow detail\n", err);
        });
    },
  });
};

// TODO: identifyUser should load flows according to the userHash
