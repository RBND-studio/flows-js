import type { Flow } from "../types";

const f = <T>(
  url: string,
  { body, method }: { method?: string; body?: unknown } = {},
): Promise<T> =>
  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    const text = await res.text();
    const resBody = (text ? JSON.parse(text) : undefined) as T;
    if (!res.ok) {
      const errorBody = resBody as undefined | { message?: string };
      throw new Error(errorBody?.message ?? res.statusText);
    }
    return resBody;
  });

interface GetFlowsResponse {
  results: Flow[];
  error_message?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- not needed
export const api = (baseUrl: string) => ({
  sendEvent: (body: {
    eventTime: string;
    type: string;
    userHash?: string;
    flowId: string;
    projectId: string;
    stepIndex?: string;
    stepHash?: string;
    flowHash: string;
    sdkVersion: string;
    targetElement?: string;
    location: string;
  }): Promise<{ id: string }> =>
    f(`${baseUrl}/sdk/events`, {
      method: "POST",
      body,
    }),
  deleteEvent: (eventId: string) => f(`${baseUrl}/sdk/events/${eventId}`, { method: "DELETE" }),
  getFlows: ({
    projectId,
    userHash,
  }: {
    projectId: string;
    userHash?: string;
  }): Promise<GetFlowsResponse> =>
    f(`${baseUrl}/v2/sdk/flows?projectId=${projectId}${userHash ? `&userHash=${userHash}` : ""}`),
  getPreviewFlow: ({ flowId, projectId }: { projectId: string; flowId: string }): Promise<Flow> =>
    f(`${baseUrl}/sdk/flows/${flowId}/draft?projectId=${projectId}`),
  getFlowDetail: ({ flowId, projectId }: { projectId: string; flowId: string }): Promise<Flow> =>
    f(`${baseUrl}/sdk/flows/${flowId}?projectId=${projectId}`),
});
