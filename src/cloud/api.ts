const f = (url: string, { body, method }: { method: string; body: unknown }): Promise<Response> =>
  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

export const sendEvent = ({
  baseUrl,
  body,
}: {
  baseUrl: string;
  body: {
    eventTime: string;
    type: string;
    userHash?: string;
    flowId: string;
    projectId: string;
    stepIndex?: string;
    stepHash?: string;
    flowHash: string;
  };
}): Promise<Response> =>
  f(`${baseUrl}/events`, {
    method: "POST",
    body,
  });
