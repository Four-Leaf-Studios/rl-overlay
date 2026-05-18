import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import {
  BroadcastProvider,
  useBroadcast,
} from "../src/context/BroadcastContext";
import { mockBroadcast } from "./fixtures";

describe("BroadcastContext", () => {
  it("provides broadcast data to children", () => {
    const TestConsumer = () => {
      const broadcast = useBroadcast();
      return <div data-testid="name">{broadcast.name}</div>;
    };

    const { getByTestId } = render(
      <BroadcastProvider broadcast={mockBroadcast}>
        <TestConsumer />
      </BroadcastProvider>,
    );

    expect(getByTestId("name").textContent).toBe("Test Broadcast");
  });

  it("throws when useBroadcast is used outside provider", () => {
    const TestConsumer = () => {
      const broadcast = useBroadcast();
      return <div>{broadcast.name}</div>;
    };

    // Suppress React error boundary noise
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      "useBroadcast must be used within a BroadcastProvider",
    );

    spy.mockRestore();
  });
});
