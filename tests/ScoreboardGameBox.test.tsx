import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ScoreboardGameBox } from "../src/ScoreboardGameBox";
import { mockBroadcast } from "./fixtures";

describe("ScoreboardGameBox", () => {
  it("calculates game number from series scores", () => {
    render(<ScoreboardGameBox broadcast={mockBroadcast} />);

    // Blue has 2, Orange has 1, so game number = 2 + 1 + 1 = 4
    expect(screen.getByText("Game 4 - BO 5")).toBeInTheDocument();
  });

  it("shows game 1 when no series scores", () => {
    const freshBroadcast = {
      ...mockBroadcast,
      teams: mockBroadcast.teams.map((t) => ({ ...t, series_score: 0 })),
    };

    render(<ScoreboardGameBox broadcast={freshBroadcast} />);
    expect(screen.getByText("Game 1 - BO 5")).toBeInTheDocument();
  });

  it("handles missing teams gracefully", () => {
    const noTeamsBroadcast = {
      ...mockBroadcast,
      teams: [],
    };

    render(<ScoreboardGameBox broadcast={noTeamsBroadcast as any} />);
    // With no teams, defaults to game 1
    expect(screen.getByText("Game 1 - BO 5")).toBeInTheDocument();
  });
});
