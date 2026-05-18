import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { ScoreboardSeriesBoxComponent } from "../src/ScoreboardSeriesBox";
import { mockBroadcast } from "./fixtures";

describe("ScoreboardSeriesBox", () => {
  const team = mockBroadcast.teams[0]; // series_score: 2

  it("renders correct number of score indicators for BO5", () => {
    const { container } = render(
      <ScoreboardSeriesBoxComponent team={team} seriesNumber={5} />,
    );

    // BO5 → ceil(5/2) = 3 indicators
    const boxes = container.querySelectorAll(".series_score_box");
    expect(boxes).toHaveLength(3);
  });

  it("marks filled indicators based on series_score", () => {
    const { container } = render(
      <ScoreboardSeriesBoxComponent team={team} seriesNumber={5} />,
    );

    // team has series_score=2, so 2 filled, 1 empty
    const filled = container.querySelectorAll(".left_series_score_box_point");
    const empty = container.querySelectorAll(".left_series_score_box_empty");
    expect(filled).toHaveLength(2);
    expect(empty).toHaveLength(1);
  });

  it("returns null when seriesNumber is 0", () => {
    const { container } = render(
      <ScoreboardSeriesBoxComponent team={team} seriesNumber={0} />,
    );

    expect(container.innerHTML).toBe("");
  });

  it("applies correct modifier for right team", () => {
    const rightTeam = mockBroadcast.teams[1]; // id: "1"
    const { container } = render(
      <ScoreboardSeriesBoxComponent team={rightTeam} seriesNumber={5} />,
    );

    expect(container.querySelector(".right_series_box")).toBeInTheDocument();
  });
});
