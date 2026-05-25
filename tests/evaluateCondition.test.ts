import { describe, it, expect } from "vitest";
import {
  evaluateCondition,
  evaluateConditions,
} from "../src/rules/evaluateCondition";
import type { RuleCondition } from "../src/types";

const ctx = {
  game: {
    time: 272,
    teams: { "0": { score: 2 }, "1": { score: 1 } },
    isReplay: true,
  },
  event: {
    goalScored: { scorer: { teamnum: 0, name: "TestPlayer" } },
  },
};

describe("evaluateCondition", () => {
  it("equals operator", () => {
    expect(
      evaluateCondition(
        { path: "game.teams.0.score", operator: "equals", value: 2 },
        ctx as any,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { path: "game.teams.0.score", operator: "equals", value: 99 },
        ctx as any,
      ),
    ).toBe(false);
  });

  it("notEquals operator", () => {
    expect(
      evaluateCondition(
        { path: "game.teams.0.score", operator: "notEquals", value: 99 },
        ctx as any,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { path: "game.teams.0.score", operator: "notEquals", value: 2 },
        ctx as any,
      ),
    ).toBe(false);
  });

  it("greaterThan operator", () => {
    expect(
      evaluateCondition(
        { path: "game.time", operator: "greaterThan", value: 200 },
        ctx as any,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { path: "game.time", operator: "greaterThan", value: 300 },
        ctx as any,
      ),
    ).toBe(false);
  });

  it("lessThan operator", () => {
    expect(
      evaluateCondition(
        { path: "game.time", operator: "lessThan", value: 300 },
        ctx as any,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { path: "game.time", operator: "lessThan", value: 100 },
        ctx as any,
      ),
    ).toBe(false);
  });

  it("greaterThanOrEqual operator", () => {
    expect(
      evaluateCondition(
        { path: "game.time", operator: "greaterThanOrEqual", value: 272 },
        ctx as any,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { path: "game.time", operator: "greaterThanOrEqual", value: 273 },
        ctx as any,
      ),
    ).toBe(false);
  });

  it("lessThanOrEqual operator", () => {
    expect(
      evaluateCondition(
        { path: "game.time", operator: "lessThanOrEqual", value: 272 },
        ctx as any,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { path: "game.time", operator: "lessThanOrEqual", value: 271 },
        ctx as any,
      ),
    ).toBe(false);
  });

  it("exists operator", () => {
    expect(
      evaluateCondition(
        { path: "game.isReplay", operator: "exists" },
        ctx as any,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { path: "game.missing", operator: "exists" },
        ctx as any,
      ),
    ).toBe(false);
  });

  it("notExists operator", () => {
    expect(
      evaluateCondition(
        { path: "game.missing", operator: "notExists" },
        ctx as any,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        { path: "game.isReplay", operator: "notExists" },
        ctx as any,
      ),
    ).toBe(false);
  });

  it("contains operator on string", () => {
    expect(
      evaluateCondition(
        {
          path: "event.goalScored.scorer.name",
          operator: "contains",
          value: "Test",
        },
        ctx as any,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        {
          path: "event.goalScored.scorer.name",
          operator: "contains",
          value: "Missing",
        },
        ctx as any,
      ),
    ).toBe(false);
  });

  it("returns false for unknown operator", () => {
    expect(
      evaluateCondition(
        { path: "game.time", operator: "unknown" as any },
        ctx as any,
      ),
    ).toBe(false);
  });
});

describe("evaluateConditions", () => {
  it("returns true when all conditions pass", () => {
    const conditions: RuleCondition[] = [
      { path: "game.time", operator: "greaterThan", value: 200 },
      { path: "game.teams.0.score", operator: "equals", value: 2 },
    ];
    expect(evaluateConditions(conditions, ctx as any)).toBe(true);
  });

  it("returns false when any condition fails", () => {
    const conditions: RuleCondition[] = [
      { path: "game.time", operator: "greaterThan", value: 200 },
      { path: "game.teams.0.score", operator: "equals", value: 99 },
    ];
    expect(evaluateConditions(conditions, ctx as any)).toBe(false);
  });

  it("returns true for empty conditions array", () => {
    expect(evaluateConditions([], ctx as any)).toBe(true);
  });
});
