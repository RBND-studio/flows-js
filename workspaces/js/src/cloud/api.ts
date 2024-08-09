import type { Flow } from "../types";
import { FlowsCloudContext } from "./options";

type Params = Record<string, string | string[] | boolean | number | undefined>;

export function createParams(params?: Params): string {
  const filteredParams = Object.entries(params ?? {}).reduce<Params>((acc, [key, value]) => {
    if (value) acc[key] = value;
    return acc;
  }, {});
  const paramsString = new URLSearchParams(filteredParams as Record<string, string>).toString();
  if (!paramsString) return "";
  return `?${paramsString}`;
}

export const getApiUrl = (): string =>
  FlowsCloudContext.getInstance().options?.customApiUrl ?? "https://api.flows-cloud.com";

const f = <T>(
  url: string,
  { body, method }: { method?: string; body?: unknown } = {},
): Promise<T> =>
  fetch(getApiUrl() + url, {
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

export const api = {
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
    f(`/sdk/events`, {
      method: "POST",
      body,
    }),
  deleteEvent: (eventId: string) => f(`/sdk/events/${eventId}`, { method: "DELETE" }),
  getFlows: ({
    projectId,
    userHash,
  }: {
    projectId: string;
    userHash?: string;
  }): Promise<GetFlowsResponse> => f(`/v2/sdk/flows${createParams({ projectId, userHash })}`),
  getPreviewFlow: ({ flowId, projectId }: { projectId: string; flowId: string }): Promise<Flow> =>
    f<Flow>(`/sdk/flows/${flowId}/draft${createParams({ projectId })}`).then((flow) => ({
      ...flow,
      draft: true,
    })),
  getFlowDetail: ({ flowId, projectId }: { projectId: string; flowId: string }): Promise<Flow> =>
    f(`/sdk/flows/${flowId}${createParams({ projectId })}`),
  resetUserProgress: ({
    projectId,
    userHash,
    flowId,
  }: {
    userHash: string;
    projectId: string;
    flowId?: string;
  }) =>
    f(`/sdk/user/${userHash}/progress${createParams({ flowId, projectId })}`, {
      method: "DELETE",
    }),
};
