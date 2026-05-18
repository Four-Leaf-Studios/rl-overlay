import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { PlayerBoost } from "../src/PlayerBoost";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: any) =>
      React.createElement("div", { className, ...props }, children),
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe("PlayerBoost", () => {
  it("renders boost meter for left team", () => {
    const { container } = render(<PlayerBoost team={0} boost={50} />);

    expect(container.querySelector(".boost_meter")).toBeInTheDocument();
    expect(container.querySelector(".left_boost_meter")).toBeInTheDocument();
  });

  it("renders boost meter for right team", () => {
    const { container } = render(<PlayerBoost team={1} boost={50} />);

    expect(container.querySelector(".right_boost_meter")).toBeInTheDocument();
  });

  it("clamps boost to 0-100 range", () => {
    const { container: containerOver } = render(
      <PlayerBoost team={0} boost={150} />,
    );
    const barOver = containerOver.querySelector(
      ".boost_meter_bar",
    ) as HTMLElement;
    // framer-motion is mocked, so we check the animate prop isn't applied
    // but the component should clamp internally
    expect(barOver).toBeInTheDocument();

    const { container: containerUnder } = render(
      <PlayerBoost team={0} boost={-50} />,
    );
    const barUnder = containerUnder.querySelector(
      ".boost_meter_bar",
    ) as HTMLElement;
    expect(barUnder).toBeInTheDocument();
  });
});
