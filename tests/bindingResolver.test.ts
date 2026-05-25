import { describe, it, expect } from "vitest";
import {
  resolvePath,
  applyFilter,
  resolveBinding,
  resolveBindingsDeep,
} from "../src/binding/bindingResolver";

const ctx = {
  game: {
    time: 272,
    teams: {
      "0": { name: "Blue Strikers", score: 2 },
      "1": { name: "Orange Thunder", score: 1 },
    },
    isReplay: false,
  },
  event: {
    goalScored: {
      scorer: { name: "TestPlayer", teamnum: 0 },
      goalspeed: 145.7,
    },
    statfeed: {
      main_target: { name: "TestPlayer" },
      secondary_target: { name: "OtherPlayer" },
    },
  },
  broadcast: { top_info_text: "Grand Finals" },
};

describe("resolvePath", () => {
  it("resolves a simple top-level key", () => {
    expect(resolvePath("game", ctx as any)).toBeDefined();
  });

  it("resolves a nested path", () => {
    expect(resolvePath("game.time", ctx as any)).toBe(272);
  });

  it("resolves a numeric array-index path", () => {
    expect(resolvePath("game.teams.0.name", ctx as any)).toBe("Blue Strikers");
    expect(resolvePath("game.teams.1.score", ctx as any)).toBe(1);
  });

  it("resolves a deeply nested path", () => {
    expect(resolvePath("event.goalScored.scorer.name", ctx as any)).toBe(
      "TestPlayer",
    );
  });

  it("returns undefined for a missing path", () => {
    expect(resolvePath("game.missing.path", ctx as any)).toBeUndefined();
  });

  it("returns undefined when traversing through null/undefined", () => {
    expect(resolvePath("event.missing.deep.key", ctx as any)).toBeUndefined();
  });

  it("returns undefined when traversing a non-object", () => {
    expect(resolvePath("game.time.something", ctx as any)).toBeUndefined();
  });
});

describe("applyFilter", () => {
  it("clock converts seconds to m:ss", () => {
    expect(applyFilter(272, "clock")).toBe("4:32");
    expect(applyFilter(0, "clock")).toBe("0:00");
    expect(applyFilter(60, "clock")).toBe("1:00");
    expect(applyFilter(61, "clock")).toBe("1:01");
  });

  it("round rounds numbers", () => {
    expect(applyFilter(145.7, "round")).toBe(146);
    expect(applyFilter(145.2, "round")).toBe(145);
  });

  it("floor floors numbers", () => {
    expect(applyFilter(145.9, "floor")).toBe(145);
  });

  it("ceil ceils numbers", () => {
    expect(applyFilter(145.1, "ceil")).toBe(146);
  });

  it("uppercase converts to uppercase", () => {
    expect(applyFilter("goal", "uppercase")).toBe("GOAL");
  });

  it("lowercase converts to lowercase", () => {
    expect(applyFilter("GOAL", "lowercase")).toBe("goal");
  });

  it("fallback returns value when present", () => {
    expect(applyFilter("hello", "fallback")).toBe("hello");
  });

  it("unknown filter returns value unchanged", () => {
    expect(applyFilter("test", "unknown")).toBe("test");
  });
});

describe("resolveBinding", () => {
  it("returns string unchanged when no bindings present", () => {
    expect(resolveBinding("no bindings here", ctx as any)).toBe(
      "no bindings here",
    );
  });

  it("resolves a single binding", () => {
    expect(resolveBinding("{{game.time}}", ctx as any)).toBe("272");
  });

  it("resolves a binding with a filter", () => {
    expect(resolveBinding("{{game.time | clock}}", ctx as any)).toBe("4:32");
  });

  it("resolves nested binding with filter", () => {
    expect(
      resolveBinding("{{event.goalScored.goalspeed | round}}", ctx as any),
    ).toBe("146");
  });

  it("replaces missing path with empty string", () => {
    expect(resolveBinding("{{game.missing}}", ctx as any)).toBe("");
  });

  it("resolves multiple bindings in one string", () => {
    expect(
      resolveBinding(
        "{{game.teams.0.name}} vs {{game.teams.1.name}}",
        ctx as any,
      ),
    ).toBe("Blue Strikers vs Orange Thunder");
  });

  it("resolves binding embedded in text", () => {
    expect(
      resolveBinding("{{event.goalScored.scorer.name}} scored!", ctx as any),
    ).toBe("TestPlayer scored!");
  });
});

describe("resolveBindingsDeep", () => {
  it("resolves bindings in nested objects", () => {
    const template = {
      title: "{{game.teams.0.name}}",
      score: "{{game.teams.0.score}}",
    };
    const result = resolveBindingsDeep(template, ctx as any) as Record<
      string,
      unknown
    >;
    expect(result.title).toBe("Blue Strikers");
    expect(result.score).toBe("2");
  });

  it("resolves bindings in arrays", () => {
    const template = ["{{game.teams.0.name}}", "{{game.teams.1.name}}"];
    const result = resolveBindingsDeep(template, ctx as any) as string[];
    expect(result[0]).toBe("Blue Strikers");
    expect(result[1]).toBe("Orange Thunder");
  });

  it("leaves non-string values untouched", () => {
    const template = { count: 42, flag: true };
    const result = resolveBindingsDeep(template, ctx as any);
    expect(result).toEqual({ count: 42, flag: true });
  });

  it("handles deeply nested objects", () => {
    const template = {
      outer: { inner: { value: "{{game.time | clock}}" } },
    };
    const result = resolveBindingsDeep(template, ctx as any) as any;
    expect(result.outer.inner.value).toBe("4:32");
  });
});
