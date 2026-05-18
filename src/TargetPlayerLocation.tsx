import React, { memo } from "react";
import { motion } from "framer-motion";
import { PlayerState } from "@four-leaf-studios/rl-socket-hook";

type Props = {
  location: PlayerState["location"];
};

export const TargetPlayerLocation = ({ location }: Props) => {
  return (
    <motion.div
      data-component-id="TargetPlayerLocation"
      className="stat_box_statistic stat_box_statistic_player_location"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.5 }}
    >
      <span className="stat_box_statistic_name">Location</span>{" "}
      <span className="stat_box_statistic_value">
        X {location.X?.toFixed(2) || 0}, Y {location.Y?.toFixed(2) || 0}, Z{" "}
        {location.Z?.toFixed(2) || 0}
      </span>
    </motion.div>
  );
};

export default memo(TargetPlayerLocation);
