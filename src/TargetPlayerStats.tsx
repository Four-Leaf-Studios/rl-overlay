// TargetPlayerStats.tsx
import React, { memo } from "react";
import { PlayerState } from "@four-leaf-studios/rl-socket-hook";
import StatItem from "./StatItem";
import TargetPlayerLocation from "./TargetPlayerLocation";

type Props = {
  targetPlayer: PlayerState;
};

export const TargetPlayerStats = ({ targetPlayer }: Props) => (
  <ul className="stat_box_statistics">
    <StatItem id="id" label="ID" value={targetPlayer.id} />
    <StatItem id="team" label="Team" value={targetPlayer.team} />
    <StatItem id="score" label="Score" value={targetPlayer.score} />
    <StatItem id="goals" label="Goals" value={targetPlayer.goals} />
    <StatItem id="assists" label="Assists" value={targetPlayer.assists} />
    <StatItem id="shots" label="Shots" value={targetPlayer.shots} />
    <StatItem id="saves" label="Saves" value={targetPlayer.saves} />
    <StatItem id="touches" label="Touches" value={targetPlayer.touches} />
    <TargetPlayerLocation location={targetPlayer.location} />
  </ul>
);

export default memo(TargetPlayerStats);
