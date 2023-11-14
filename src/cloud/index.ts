import { init as flowsInit } from "../index";
import type { FlowsCloudOptions } from "../types";
import { hash } from "../utils";
import { sendEvent } from "./api";

export * from "../index";

export const init = (options: FlowsCloudOptions): void => {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://api.flows-cloud.com"
      : "https://api.stage.flows-cloud.com";

  flowsInit({
    ...options,
    tracking: (event) => {
      options.tracking?.(event);

      const { flowHash, flowId, type, projectId, stepIndex, stepHash, userId } = event;

      void (async () =>
        sendEvent({
          baseUrl: API_URL,
          body: {
            eventTime: new Date().toISOString(),
            flowHash,
            flowId,
            projectId,
            type,
            stepHash,
            stepIndex: stepIndex?.toString(),
            userHash: userId ? await hash(userId) : undefined,
          },
        }))();
    },
  });
};
