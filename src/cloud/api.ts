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
  }).then((res) => res.json() as Promise<T>);

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
  }): Promise<void> =>
    f(`${baseUrl}/events`, {
      method: "POST",
      body,
    }),
  getFlows: (projectId: string): Promise<Flow[]> => f(`${baseUrl}/flows?projectId=${projectId}`),
});
