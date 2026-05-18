import React, { memo } from "react";
import { Team } from "./types";

interface ScoreboardSeriesBoxProps {
  team: Team;
  seriesNumber: number;
}

export const ScoreboardSeriesBoxComponent: React.FC<
  ScoreboardSeriesBoxProps
> = ({ team, seriesNumber }) => {
  if (!seriesNumber) return null;

  const bestOf = Number(seriesNumber);
  const teamSeriesScore = Number(team.series_score) || 0;
  const pointsCount = Math.ceil(bestOf / 2);
  const points = Array.from({ length: pointsCount }, (_, index) => index);

  const isLeftTeam = team.id === "0";
  const modifier = isLeftTeam ? "left" : "right";
  const teamColor =
    team.color?.primary_color || (isLeftTeam ? "#0052cc" : "#ff6600");

  return (
    <div
      data-component-id="ScoreboardSeriesBox"
      className={`series_box ${modifier}_series_box`}
      style={{ "--team-color": teamColor } as React.CSSProperties}
    >
      {points.map((index) => {
        const pointClass =
          index < teamSeriesScore
            ? `series_score_box_point ${modifier}_series_score_box_point`
            : `series_score_box_empty ${modifier}_series_score_box_empty`;
        return <div key={index} className={`series_score_box ${pointClass}`} />;
      })}
    </div>
  );
};

const ScoreboardSeriesBox = memo(ScoreboardSeriesBoxComponent);
ScoreboardSeriesBox.displayName = "ScoreboardSeriesBox";
export default ScoreboardSeriesBox;
