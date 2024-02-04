import { version } from "../../package.json";

export const loadStyle = ({ apiUrl, projectId }: { apiUrl: string; projectId: string }): void => {
  const styleEl =
    (document.querySelector("#flows-cloud-styles") as HTMLLinkElement | undefined) ??
    document.createElement("link");
  styleEl.id = "flows-cloud-styles";
  styleEl.rel = "stylesheet";
  styleEl.href = `${apiUrl}/sdk/css?projectId=${projectId}&v=${version}`;
  document.head.appendChild(styleEl);
};
