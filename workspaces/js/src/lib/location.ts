export const getPathname = (): string => window.location.pathname + window.location.search;

export const parsePreviewFlowId = (
  pathname: string,
): { flowId: string; projectId: string } | undefined => {
  const params = new URLSearchParams(pathname.split("?")[1] ?? "");
  const flowId = params.get("flows-flow-id");
  const projectId = params.get("flows-project-id");

  if (!flowId || !projectId) return;

  return { flowId, projectId };
};
