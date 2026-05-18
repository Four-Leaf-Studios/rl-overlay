import { describe, it, expect } from "vitest";
import { componentRegistry } from "../src/registry";

describe("componentRegistry", () => {
  it("contains all expected components", () => {
    const expectedKeys = [
      "Scoreboard",
      "Teams",
      "TargetPlayer",
      "TargetBoost",
      "Replay",
      "Timer",
      "PlayerBoost",
    ];

    for (const key of expectedKeys) {
      expect(componentRegistry).toHaveProperty(key);
      // Components may be functions or memo objects
      expect(componentRegistry[key]).toBeTruthy();
    }
  });

  it("does not contain unexpected entries", () => {
    const keys = Object.keys(componentRegistry);
    expect(keys.length).toBe(7);
  });
});
