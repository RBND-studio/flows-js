/* eslint-disable @typescript-eslint/no-explicit-any -- handy in this file */

export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timerFlag: number | null = null;

  return (...args) => {
    if (timerFlag === null) {
      fn(...args);
      timerFlag = window.setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
  };
};
