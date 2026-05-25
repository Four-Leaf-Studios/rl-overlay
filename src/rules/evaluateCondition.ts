import type { RuleCondition, RuleOperator } from "../types";
import { resolvePath } from "../binding/bindingResolver";

export function evaluateCondition(
  condition: RuleCondition,
  context: Record<string, unknown>,
): boolean {
  const actual = resolvePath(condition.path, context);
  const expected = condition.value;

  switch (condition.operator as RuleOperator) {
    case "equals":
      // eslint-disable-next-line eqeqeq
      return actual == expected;
    case "notEquals":
      // eslint-disable-next-line eqeqeq
      return actual != expected;
    case "greaterThan":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual > expected
      );
    case "lessThan":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual < expected
      );
    case "greaterThanOrEqual":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual >= expected
      );
    case "lessThanOrEqual":
      return (
        typeof actual === "number" &&
        typeof expected === "number" &&
        actual <= expected
      );
    case "exists":
      return actual !== undefined && actual !== null;
    case "notExists":
      return actual === undefined || actual === null;
    case "contains":
      if (typeof actual === "string" && typeof expected === "string")
        return actual.includes(expected);
      if (Array.isArray(actual)) return actual.includes(expected);
      return false;
    default:
      return false;
  }
}

export function evaluateConditions(
  conditions: RuleCondition[],
  context: Record<string, unknown>,
): boolean {
  return conditions.every((c) => evaluateCondition(c, context));
}
