import React from "react";

import { useMemo } from "react";
import { Broadcast } from "./types";

interface ScoreboardGameBoxProps {
  broadcast: Broadcast;
}

export const ScoreboardGameBox: React.FC<ScoreboardGameBoxProps> = ({
  broadcast,
}) => {
  const gameNumber = useMemo(() => {
    if (!broadcast.teams || broadcast.teams.length < 2) return 1;
    const team0Score = broadcast.teams[0].series_score || 0;
    const team1Score = broadcast.teams[1].series_score || 0;
    return team0Score + team1Score + 1;
  }, [broadcast.teams]);

  return (
    <div className="game_box">
      Game {gameNumber} - BO {broadcast.series_number}
    </div>
  );
};

export default ScoreboardGameBox;
