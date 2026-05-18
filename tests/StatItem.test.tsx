import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { StatItem } from "../src/StatItem";

describe("StatItem", () => {
  it("renders label and value", () => {
    render(<StatItem id="goals" label="Goals" value={5} />);

    expect(screen.getByText("Goals")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("applies correct CSS class based on id", () => {
    const { container } = render(
      <StatItem id="assists" label="Assists" value={3} />,
    );

    expect(
      container.querySelector(".stat_box_statistic_player_assists"),
    ).toBeInTheDocument();
  });

  it("renders string values", () => {
    render(<StatItem id="name" label="Name" value="TestPlayer" />);
    expect(screen.getByText("TestPlayer")).toBeInTheDocument();
  });

  it("renders numeric zero", () => {
    render(<StatItem id="saves" label="Saves" value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
