import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { useRuleEngine } from "../src/rules/ruleEngine";
import type {
  OverlayRule,
  OverlayDataContext,
  OverlayComponentConfig,
} from "../src/types";

vi.useFakeTimers();

const makeContext = (
  overrides: Partial<OverlayDataContext> = {},
): OverlayDataContext => ({
  game: { hasGame: true, teams: {} },
  players: {},
  event: { last: null },
  ...overrides,
});

const components: OverlayComponentConfig[] = [
  { id: "comp-1", code_id: "builtin.scorebug" },
  { id: "goal-popup", code_id: "builtin.goal-popup" },
];

describe("useRuleEngine", () => {
  afterEach(() => {
    vi.clearAllTimers();
  });

  it("starts with empty runtime state", () => {
    const ctx = makeContext();
    const { result } = renderHook(() => useRuleEngine([], components, ctx));
    expect(result.current.runtimeState).toEqual({});
  });

  it("fires show action when event trigger matches", async () => {
    let ctx = makeContext();

    const rules: OverlayRule[] = [
      {
        enabled: true,
        trigger: { type: "event", event: "game:goal_scored" },
        conditions: [],
        actions: [{ type: "show", componentId: "goal-popup" }],
      },
    ];

    const { result, rerender } = renderHook(
      ({ context }) => useRuleEngine(rules, components, context),
      { initialProps: { context: ctx } },
    );

    // Simulate a new event arriving
    ctx = makeContext({
      event: {
        last: { name: "game:goal_scored", payload: {}, receivedAt: 1000 },
        goalScored: {},
      },
    });

    await act(async () => {
      rerender({ context: ctx });
    });

    expect(result.current.runtimeState["goal-popup"]?.visible).toBe(true);
  });

  it("does not fire disabled rules", async () => {
    let ctx = makeContext();

    const rules: OverlayRule[] = [
      {
        enabled: false,
        trigger: { type: "event", event: "game:goal_scored" },
        conditions: [],
        actions: [{ type: "show", componentId: "goal-popup" }],
      },
    ];

    const { result, rerender } = renderHook(
      ({ context }) => useRuleEngine(rules, components, context),
      { initialProps: { context: ctx } },
    );

    ctx = makeContext({
      event: {
        last: { name: "game:goal_scored", payload: {}, receivedAt: 2000 },
      },
    });

    await act(async () => {
      rerender({ context: ctx });
    });

    expect(result.current.runtimeState["goal-popup"]).toBeUndefined();
  });

  it("hides component after durationMs", async () => {
    let ctx = makeContext();

    const rules: OverlayRule[] = [
      {
        enabled: true,
        trigger: { type: "event", event: "game:goal_scored" },
        conditions: [],
        actions: [
          { type: "show", componentId: "goal-popup", durationMs: 5000 },
        ],
      },
    ];

    const { result, rerender } = renderHook(
      ({ context }) => useRuleEngine(rules, components, context),
      { initialProps: { context: ctx } },
    );

    ctx = makeContext({
      event: {
        last: { name: "game:goal_scored", payload: {}, receivedAt: 3000 },
      },
    });

    await act(async () => {
      rerender({ context: ctx });
    });

    expect(result.current.runtimeState["goal-popup"]?.visible).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(5001);
    });

    expect(result.current.runtimeState["goal-popup"]?.visible).toBe(false);
  });

  it("sets state via setState action", async () => {
    let ctx = makeContext();

    const rules: OverlayRule[] = [
      {
        enabled: true,
        trigger: { type: "event", event: "game:goal_scored" },
        conditions: [],
        actions: [
          { type: "setState", componentId: "goal-popup", state: "blueGoal" },
        ],
      },
    ];

    const { result, rerender } = renderHook(
      ({ context }) => useRuleEngine(rules, components, context),
      { initialProps: { context: ctx } },
    );

    ctx = makeContext({
      event: {
        last: { name: "game:goal_scored", payload: {}, receivedAt: 4000 },
      },
    });

    await act(async () => {
      rerender({ context: ctx });
    });

    expect(result.current.runtimeState["goal-popup"]?.activeState).toBe(
      "blueGoal",
    );
  });

  it("applies setStyle action", async () => {
    let ctx = makeContext();

    const rules: OverlayRule[] = [
      {
        enabled: true,
        trigger: { type: "event", event: "game:goal_scored" },
        conditions: [],
        actions: [
          {
            type: "setStyle",
            componentId: "goal-popup",
            style: { color: "blue" },
          },
        ],
      },
    ];

    const { result, rerender } = renderHook(
      ({ context }) => useRuleEngine(rules, components, context),
      { initialProps: { context: ctx } },
    );

    ctx = makeContext({
      event: {
        last: { name: "game:goal_scored", payload: {}, receivedAt: 5000 },
      },
    });

    await act(async () => {
      rerender({ context: ctx });
    });

    expect(result.current.runtimeState["goal-popup"]?.stylePatches?.color).toBe(
      "blue",
    );
  });

  it("fireEvent manually triggers event-based rules", async () => {
    const ctx = makeContext();

    const rules: OverlayRule[] = [
      {
        enabled: true,
        trigger: { type: "event", event: "game:goal_scored" },
        conditions: [],
        actions: [{ type: "show", componentId: "goal-popup" }],
      },
    ];

    const { result } = renderHook(() => useRuleEngine(rules, components, ctx));

    await act(async () => {
      result.current.fireEvent("game:goal_scored", {});
    });

    expect(result.current.runtimeState["goal-popup"]?.visible).toBe(true);
  });

  it("condition prevents rule from firing when not met", async () => {
    let ctx = makeContext();

    const rules: OverlayRule[] = [
      {
        enabled: true,
        trigger: { type: "event", event: "game:goal_scored" },
        conditions: [
          {
            path: "event.goalScored.scorer.teamnum",
            operator: "equals",
            value: 0,
          },
        ],
        actions: [{ type: "show", componentId: "goal-popup" }],
      },
    ];

    const { result, rerender } = renderHook(
      ({ context }) => useRuleEngine(rules, components, context),
      { initialProps: { context: ctx } },
    );

    // teamnum is 1, not 0 — condition should fail
    ctx = makeContext({
      event: {
        last: { name: "game:goal_scored", payload: {}, receivedAt: 6000 },
        goalScored: { scorer: { teamnum: 1 } },
      },
    });

    await act(async () => {
      rerender({ context: ctx });
    });

    expect(result.current.runtimeState["goal-popup"]).toBeUndefined();
  });
});
