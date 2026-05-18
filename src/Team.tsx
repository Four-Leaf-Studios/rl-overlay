import { useEventSelector } from "@four-leaf-studios/rl-socket-hook";
import { motion, AnimatePresence } from "framer-motion";
import React, { memo } from "react";
import { Team as TeamType } from "./types";
import Player from "./Player";

type Props = {
  id: TeamType["id"];
};

export const Team = ({ id }: Props) => {
  const players = useEventSelector("game:update_state", (state) => {
    return (
      state?.players &&
      Object.values(state?.players).filter(
        (player) => player.team.toString() === id
      )
    );
  });

  const isLeft = id === "0";
  const modifier = isLeft ? "left" : "right";

  if (!players) return null;

  return (
    <motion.div
      data-component-id="Team"
      className={`team_box ${modifier}_team_box`}
      initial={{ x: isLeft ? -300 : 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: isLeft ? -300 : 300, opacity: 0 }}
      transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
    >
      <AnimatePresence>
        {players.map((player) => (
          <Player player={player} key={player.id} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

const MemoizedTeam = memo(Team);
MemoizedTeam.displayName = "Team";
export default MemoizedTeam;
