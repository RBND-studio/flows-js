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
  const allValuesMatch = wait.form.values.every((valueDef) => {
    const input = form.querySelector(valueDef.element);
    if (!input || !("value" in input)) return false;
    return input.value === valueDef.value;
  });
  return allValuesMatch;
};

export const changeWaitMatch = ({
  target,
  wait,
}: {
  wait: WaitStepOptions;
  target: Element;
}): boolean => {
  if (!wait.change) return false;
  const someElementIsTarget = wait.change.some((changeDef) => target.matches(changeDef.element));
  if (!someElementIsTarget) return false;
  const allValuesMatch = wait.change.every((changeDef) => {
    const el = document.querySelector(changeDef.element);
    if (!el || !("value" in el) || typeof el.value !== "string") return false;
    if (changeDef.value instanceof RegExp) return changeDef.value.test(el.value);
    return el.value === changeDef.value;
  });
  return allValuesMatch;
};

export const locationMatch = ({
  location,
  pathname,
}: {
  location: string;
  pathname: string;
}): boolean => new RegExp(location).test(pathname);
