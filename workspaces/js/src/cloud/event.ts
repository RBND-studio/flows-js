import type { DebugEvent, TrackingEvent } from "../types";
import { version } from "../lib/version";
import { log } from "../lib/log";
import { hash } from "../lib/hash";
import { api } from "./api";

export const saveEvent = async ({
  apiUrl,
  event,
}: {
  apiUrl: string;
  event: DebugEvent | TrackingEvent;
}): Promise<{ referenceId: string } | undefined> => {
  const { flowHash, flowId, type, projectId = "", stepIndex, stepHash, userId, location } = event;
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
      sdkVersion: version,
      targetElement: "targetElement" in event ? event.targetElement : undefined,
      location,
    })
    .then((res) => ({ referenceId: res.id }))
    .catch((err) => {
      log.error("Failed to send event to cloud", err);
      return undefined;
    });
};
