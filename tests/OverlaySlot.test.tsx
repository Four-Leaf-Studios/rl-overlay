import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { OverlaySlot } from "../src/OverlaySlot";

describe("OverlaySlot", () => {
  const baseComponent = {
    id: "slot-1",
    name: "TestSlot",
    css: "",
    code_id: "TestComponent",
    position: { top: 50, left: 100, width: 200, height: 150 },
  };

  it("renders children inside positioned container", () => {
    const { container, getByText } = render(
      <OverlaySlot component={baseComponent}>
        <span>Content</span>
      </OverlaySlot>,
    );

    expect(getByText("Content")).toBeInTheDocument();
    const slot = container.querySelector(".overlay-slot");
    expect(slot).toBeInTheDocument();
  });

  it("applies position styles from component data", () => {
    const { container } = render(
      <OverlaySlot component={baseComponent}>
        <span>Content</span>
      </OverlaySlot>,
    );

    const slot = container.querySelector(".overlay-slot") as HTMLElement;
    expect(slot.style.position).toBe("absolute");
    expect(slot.style.top).toBe("50px");
    expect(slot.style.left).toBe("100px");
    expect(slot.style.width).toBe("200px");
    expect(slot.style.height).toBe("150px");
  });

  it("uses default position values when position is undefined", () => {
    const componentNoPosition = { ...baseComponent, position: undefined };
    const { container } = render(
      <OverlaySlot component={componentNoPosition}>
        <span>Content</span>
      </OverlaySlot>,
    );

    const slot = container.querySelector(".overlay-slot") as HTMLElement;
    expect(slot.style.top).toBe("0px");
    expect(slot.style.left).toBe("0px");
    expect(slot.style.width).toBe("auto");
    expect(slot.style.height).toBe("auto");
  });

  it("sets data attributes from component", () => {
    const { container } = render(
      <OverlaySlot component={baseComponent}>
        <span>Content</span>
      </OverlaySlot>,
    );

    const slot = container.querySelector(".overlay-slot");
    expect(slot?.getAttribute("data-component-id")).toBe("slot-1");
    expect(slot?.getAttribute("data-component-name")).toBe("TestSlot");
  });

  it("passes extra div props through", () => {
    const { container } = render(
      <OverlaySlot component={baseComponent} data-custom="value">
        <span>Content</span>
      </OverlaySlot>,
    );

    const slot = container.querySelector(".overlay-slot");
    expect(slot?.getAttribute("data-custom")).toBe("value");
  });
});
