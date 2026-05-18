import { PlayerState } from "@four-leaf-studios/rl-socket-hook";
import React, { memo } from "react";
import { motion } from "framer-motion";

type Props = {
  team: PlayerState["team"];
  boost: PlayerState["boost"];
};

export const PlayerBoost = ({ team, boost }: Props) => {
  const boostPercent = Math.min(Math.max(boost, 0), 100);
  const modifier = team === 0 ? "left" : "right";

  return (
    <div
      data-component-id="PlayerBoost"
      className={`boost_meter ${modifier}_boost_meter`}
    >
      <motion.div
        className={`boost_meter_bar ${modifier}_boost_meter_bar`}
        initial={{ width: "0%" }}
        animate={{ width: `${boostPercent}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

export default memo(PlayerBoost);
