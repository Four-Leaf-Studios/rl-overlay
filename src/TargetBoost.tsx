import { useEventSelector } from "@four-leaf-studios/rl-socket-hook";
import { AnimatePresence, motion } from "framer-motion";
import React, { memo } from "react";
import useTargetPlayer from "./hooks/useTargetPlayer";

export const TargetBoost = () => {
  const initialized = useEventSelector(
    "game:update_state",
    (state) => state?.hasGame
  );
  const targetPlayer = useTargetPlayer();

  if (!targetPlayer || !initialized) return null;

  const modifier = targetPlayer.team === 0 ? "left" : "right";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        data-component-id="TargetBoost"
        key={targetPlayer.id}
        className={`target_boost ${modifier}_target_boost`}
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0, scale: 0.9 }}
        transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }} // Quartic easing equivalent
      >
        <div
          className={`target_boost_container ${modifier}_target_boost_container`}
        >
          <div
            className={`target_boost_meter ${modifier}_target_boost_meter`}
            style={
              { "--target_boost": targetPlayer.boost } as React.CSSProperties
            }
          >
            <div
              className={`target_boost_meter_inner ${modifier}_target_boost_meter_inner`}
            ></div>
          </div>
          <svg className="target_boost_svg">
            <circle
              className={`target_boost_svg_circle ${modifier}_target_boost_svg_circle`}
              cx="50%"
              cy="50%"
              r="50%"
            />
          </svg>
        </div>
        <motion.div
          className={`target_boost_value ${modifier}_target_boost_value`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {targetPlayer.boost}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(TargetBoost);
