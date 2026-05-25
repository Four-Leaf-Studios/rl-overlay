import type { RuleCondition } from "../types";
export declare function evaluateCondition(condition: RuleCondition, context: Record<string, unknown>): boolean;
export declare function evaluateConditions(conditions: RuleCondition[], context: Record<string, unknown>): boolean;
