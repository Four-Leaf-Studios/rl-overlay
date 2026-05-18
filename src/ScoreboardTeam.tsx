import { useEventSelector } from "@four-leaf-studios/rl-socket-hook";
import React from "react";
import { Team } from "./types";

interface ScoreboardTeamProps {
  team: Team;
}

export const ScoreboardTeam: React.FC<ScoreboardTeamProps> = ({ team }) => {
  const score = useEventSelector(
    "game:update_state",
    (state) => state?.game.teams?.[team.id]?.score
  );

  const isLeftTeam = team.id === "0";
  const modifier = isLeftTeam ? "left" : "right";
  const teamColor = team?.color?.primary_color;

  return (
    <div
      data-component-id="ScoreboardTeam"
      className={`scoreboard_team_box ${modifier}_scoreboard_team_box`}
      style={{ "--team-color": teamColor } as React.CSSProperties}
    >
      <div className={`name_box ${modifier}_name_box`}>
        {team?.name || (isLeftTeam ? "Blue Team" : "Orange Team")}
      </div>
      {team?.logo && (
        <img
          className={`logo_box ${modifier}_logo_box`}
          src={team.logo || "/placeholder.svg"}
          alt={team.name}
        />
      )}
      <div className={`score_box ${modifier}_score_box`}>{score}</div>
    </div>
  );
};

export default ScoreboardTeam;
