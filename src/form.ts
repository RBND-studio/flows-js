import type { WaitStepOptions } from "./types";

export const formWaitMatch = ({
  form,
  wait,
}: {
  wait: WaitStepOptions;
  form: Element;
}): boolean => {
  if (!wait.form) return false;
  if (!form.matches(wait.form.element)) return false;
  return wait.form.values.every((valueDef) => {
    const input = form.querySelector(valueDef.element);
    if (!input || !("value" in input)) return false;
    return input.value === valueDef.value;
  });
};
