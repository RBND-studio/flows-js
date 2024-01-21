// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any is correct here
export function ready(fn: (...args: any[]) => any): void {
  if (document.readyState !== "loading") {
    fn();
    return;
  }
  document.addEventListener("DOMContentLoaded", fn);
}
