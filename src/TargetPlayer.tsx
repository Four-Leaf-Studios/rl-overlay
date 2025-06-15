// src/components/TargetPlayer.tsx

import { AnimatePresence, motion } from "framer-motion";
import React, { memo } from "react";
import { useBroadcast } from "./context/BroadcastContext";
import PlayerBoost from "./PlayerBoost";
import TargetPlayerStats from "./TargetPlayerStats";
import useTargetPlayer from "./hooks/useTargetPlayer";

export const TargetPlayer = () => {
  const broadcast = useBroadcast();
  const targetPlayer = useTargetPlayer();

  // Safeguard conditions
  if (
    !targetPlayer ||
    !broadcast ||
    !broadcast.teams ||
    !broadcast.teams[targetPlayer.team]
  ) {
    return null;
  }

  const teamData = broadcast.teams[targetPlayer.team];
  const teamColor = teamData?.color?.primary_color ?? "#ffffff";
  const modifier = targetPlayer.team === 0 ? "left" : "right";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={targetPlayer.id}
        className={`stat_box ${modifier}_stat_box`}
        style={{ "--team-color": teamColor } as React.CSSProperties}
        initial={{ x: modifier === "left" ? -300 : 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: modifier === "left" ? -300 : 300, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
      >
        <motion.div
          className={`stat_box_player ${modifier}_stat_box_player`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {targetPlayer.name}
        </motion.div>

        {/* Player Stats */}
        <TargetPlayerStats targetPlayer={targetPlayer} />

        {/* Player Boost */}
        <motion.div
          className={`stat_box_player_boost ${modifier}_stat_box_player_boost`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <PlayerBoost boost={targetPlayer.boost} team={targetPlayer.team} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(TargetPlayer);
