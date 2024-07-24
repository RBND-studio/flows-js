import { version } from "../lib/version";
import { getApiUrl } from "./api";

export const loadStyle = (projectId: string): void => {
  const styleEl =
    (document.querySelector("#flows-cloud-styles") as HTMLLinkElement | undefined) ??
    document.createElement("link");
  styleEl.id = "flows-cloud-styles";
  styleEl.rel = "stylesheet";
  styleEl.href = `${getApiUrl()}/sdk/css?projectId=${projectId}&v=${version}`;
  document.head.appendChild(styleEl);
};
