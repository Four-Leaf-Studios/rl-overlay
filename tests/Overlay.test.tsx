import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Overlay } from "../src/Overlay";
import { mockBroadcast, mockOverlay } from "./fixtures";

vi.mock("@four-leaf-studios/rl-socket-hook", () => ({
  useEventSelector: vi.fn(() => null),
  useEvent: vi.fn(() => null),
  RLProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", { "data-testid": "rl-provider" }, children),
  WebsocketData: () =>
    React.createElement("div", { "data-testid": "websocket-data" }),
}));

describe("Overlay", () => {
  it("renders overlay wrapper with components", () => {
    const { container } = render(
      <Overlay broadcast={mockBroadcast} overlay={mockOverlay} />,
    );

    expect(container.querySelector(".overlay-wrapper")).toBeInTheDocument();
    expect(container.querySelector(".overlay")).toBeInTheDocument();
  });

  it("renders overlay slots for each component", () => {
    const { container } = render(
      <Overlay broadcast={mockBroadcast} overlay={mockOverlay} />,
    );

    const slots = container.querySelectorAll(".overlay-slot");
    expect(slots).toHaveLength(mockOverlay.components.length);
  });

  it("injects CSS from components into a style tag", () => {
    const { container } = render(
      <Overlay broadcast={mockBroadcast} overlay={mockOverlay} />,
    );

    const style = container.querySelector("style");
    expect(style).toBeInTheDocument();
    expect(style?.textContent).toContain(".scoreboard_box");
    expect(style?.textContent).toContain(".team_box");
  });

  it("shows preview data panel when preview is true", () => {
    const { container } = render(
      <Overlay broadcast={mockBroadcast} overlay={mockOverlay} preview />,
    );

    expect(container.querySelector(".testing")).toBeInTheDocument();
    expect(container.querySelector(".testing-data")).toBeInTheDocument();
  });

  it("does not show preview panel when preview is false", () => {
    const { container } = render(
      <Overlay broadcast={mockBroadcast} overlay={mockOverlay} />,
    );

    expect(container.querySelector(".testing-data")).not.toBeInTheDocument();
  });

  it("shows missing component message for unknown code_id", () => {
    const overlayWithBadComponent = {
      components: [
        {
          id: "comp-bad",
          name: "Unknown",
          css: "",
          code_id: "NonExistent",
          position: { top: 0, left: 0 },
        },
      ],
    };

    render(
      <Overlay broadcast={mockBroadcast} overlay={overlayWithBadComponent} />,
    );

    expect(
      screen.getByText(/Missing component: NonExistent/),
    ).toBeInTheDocument();
  });

  it("uses renderSlot when provided", () => {
    const renderSlot = vi.fn((comp, Comp) =>
      React.createElement("div", {
        key: comp.id,
        "data-testid": "custom-slot",
      }),
    );

    render(
      <Overlay
        broadcast={mockBroadcast}
        overlay={mockOverlay}
        renderSlot={renderSlot}
      />,
    );

    expect(renderSlot).toHaveBeenCalledTimes(mockOverlay.components.length);
    expect(screen.getAllByTestId("custom-slot")).toHaveLength(
      mockOverlay.components.length,
    );
  });
});
