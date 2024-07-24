export const getPathname = (): string => window.location.pathname + window.location.search;

export const parsePreviewFlowId = (pathname: string): { flowId: string } | undefined => {
  const params = new URLSearchParams(pathname.split("?")[1] ?? "");
  const flowId = params.get("flows-flow-id");

  if (!flowId) return;

  return { flowId };
};
