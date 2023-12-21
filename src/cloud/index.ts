import { startFlow } from "../public-methods";
import { init as flowsInit } from "../init";
import type { FlowsCloudOptions } from "../types";
import { hash } from "../utils";
import { api } from "./api";

export * from "../index";

export const init = async (options: FlowsCloudOptions): Promise<void> => {
  const apiUrl = options.customApiUrl ?? "https://api.flows-cloud.com";

  const flows = await api(apiUrl)
    .getFlows({
      projectId: options.projectId,
      userHash: options.userId ? await hash(options.userId) : undefined,
    })
    .catch((err) => {
      // eslint-disable-next-line no-console -- useful for debugging
      console.error(`Failed to fetch flows from cloud with projectId: ${options.projectId}`, err);
    });

  flowsInit({
    ...options,
    flows: [...(options.flows ?? []), ...(flows || [])],
    tracking: (event) => {
      options.tracking?.(event);

      const { flowHash, flowId, type, projectId, stepIndex, stepHash, userId } = event;

      void (async () =>
        api(apiUrl).sendEvent({
          eventTime: new Date().toISOString(),
          flowHash,
          flowId,
          projectId,
          type,
          stepHash,
          stepIndex: stepIndex?.toString(),
          userHash: userId ? await hash(userId) : undefined,
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
          context.addFlow({ ...flow, draft: true });
          startFlow(flow.id, { startDraft: true });
        });
    },
  });
};

// TODO: identifyUser should load flows according to the userHash
