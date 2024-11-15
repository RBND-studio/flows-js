// TODO: write tests for this function
export const locationMatch = ({
  value,
  pathname,
  operator,
}: {
  pathname?: string;
  operator?: string;
  value?: string[];
}): boolean => {
  if (!pathname) return false;

  const values = (value ?? []).filter(Boolean);
  if (!operator || !values.length) return true;

  if (operator === "contains") return values.some((v) => pathname.includes(v));
  if (operator === "notContains") return values.every((v) => !pathname.includes(v));
  if (operator === "regex") return values.some((v) => new RegExp(v).test(pathname));

  return false;
};

// TODO: write tests for this function
export const clickMatch = ({
  eventTarget,
  value,
}: {
  eventTarget: Element;
  value: string;
}): boolean => Array.from(document.querySelectorAll(value)).some((el) => el.contains(eventTarget));
