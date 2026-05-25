import { describe, it, expect } from "vitest";
import { componentRegistry } from "../src/registry";

describe("componentRegistry", () => {
  it("contains all legacy components", () => {
    const legacyKeys = [
      "Scoreboard",
      "Teams",
      "TargetPlayer",
      "TargetBoost",
      "Replay",
      "Timer",
      "PlayerBoost",
    ];

    for (const key of legacyKeys) {
      expect(componentRegistry).toHaveProperty(key);
      expect(componentRegistry[key]).toBeTruthy();
    }
  });

  it("contains all builtin namespaced components", () => {
    const builtinKeys = [
      "builtin.scorebug",
      "builtin.team-logo",
      "builtin.game-clock",
      "builtin.goal-popup",
      "builtin.replay-banner",
      "builtin.stat-feed",
      "builtin.player-card",
      "builtin.boost-meter",
    ];

    for (const key of builtinKeys) {
      expect(componentRegistry).toHaveProperty(key);
      expect(componentRegistry[key]).toBeTruthy();
    }
  });

  it("maps builtin aliases to the same components as their legacy equivalents", () => {
    expect(componentRegistry["builtin.scorebug"]).toBe(
      componentRegistry["Scoreboard"],
    );
    expect(componentRegistry["builtin.team-logo"]).toBe(
      componentRegistry["Teams"],
    );
    expect(componentRegistry["builtin.game-clock"]).toBe(
      componentRegistry["Timer"],
    );
    expect(componentRegistry["builtin.replay-banner"]).toBe(
      componentRegistry["Replay"],
    );
    expect(componentRegistry["builtin.player-card"]).toBe(
      componentRegistry["TargetPlayer"],
    );
    expect(componentRegistry["builtin.boost-meter"]).toBe(
      componentRegistry["TargetBoost"],
    );
  });
});
