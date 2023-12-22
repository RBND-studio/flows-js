export const log = {
  error: (message: string, ...args: unknown[]): void => {
    // eslint-disable-next-line no-console -- ignore
    console.error(
      `%cFlows%c ${message}`,
      "color:#fff;background:#ec6441;padding:2px 4px;border-radius:4px",
      "",
      ...args,
    );
  },
};
