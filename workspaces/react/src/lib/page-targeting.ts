// TODO: write tests for this function
export const locationMatch = ({
  pageTargetingValues,
  pathname,
  pageTargetingOperator,
}: {
  pathname?: string;
  pageTargetingOperator?: string;
  pageTargetingValues?: string[];
}): boolean => {
  if (!pathname) return false;

  const operator = pageTargetingOperator;
  const values = (pageTargetingValues ?? []).filter(Boolean);
  if (!operator || !values.length) return true;

  if (operator === "contains") return values.some((v) => pathname.includes(v));
  if (operator === "notContains") return values.every((v) => !pathname.includes(v));
  if (operator === "regex") return values.some((v) => new RegExp(v).test(pathname));

  return false;
};
