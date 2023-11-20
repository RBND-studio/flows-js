import { init as flowsInit } from "../index";
import type { FlowsCloudOptions } from "../types";
import { hash } from "../utils";
import { api } from "./api";

export * from "../index";

export const init = async (options: FlowsCloudOptions): Promise<void> => {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://api.flows-cloud.com"
      : "https://api.stage.flows-cloud.com";

  const flows = await api(API_URL)
    .getFlows(options.projectId)
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
        api(API_URL).sendEvent({
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
  });
};
