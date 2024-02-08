/* eslint-disable no-console -- We are defining user facing console logs */

const badge = "%cFlows%c";
const badgeCss = "color:#fff;background:#ec6441;padding:2px 4px;border-radius:4px";

export const log = {
  error: (message: string, ...args: unknown[]): void => {
    console.error(`${badge} ${message}`, badgeCss, "", ...args);
  },
  warn: (message: string, ...args: unknown[]): void => {
    console.warn(`${badge} ${message}`, badgeCss, "", ...args);
  },
};
