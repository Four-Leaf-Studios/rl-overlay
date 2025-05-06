import React, { memo, useRef } from "react";
import { motion } from "framer-motion";
import { PlayerState } from "@four-leaf-studios/rl-socket-hook";
import PlayerBoost from "./PlayerBoost";

type Props = {
  player: PlayerState;
};

const Player = ({ player }: Props) => {
  const modifier = player.team === 0 ? "left" : "right";

  return (
    <motion.div
      key={player.id}
      className={`player_box ${modifier}_player_box`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={`player_boost ${modifier}_player_boost`}>
        {player.boost}
      </div>
      <div className={`player_name ${modifier}_player_name`}>{player.name}</div>
      <PlayerBoost key={player.id} boost={player.boost} team={player.team} />
    </motion.div>
  );
};

export default memo(Player);
