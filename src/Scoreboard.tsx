import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import useShowGameComponents from "./hooks/useShowGameComponents";
import { useBroadcast } from "./context/BroadcastContext";
import ScoreboardTeam from "./ScoreboardTeam";
import Timer from "./Timer";
import ScoreboardSeriesBox from "./ScoreboardSeriesBox";
import ScoreboardGameBox from "./ScoreboardGameBox";
import useReplay from "./hooks/useReplay";

export const Scoreboard = () => {
  const broadcast = useBroadcast();
  const showGameComponents = useShowGameComponents();
  const { active: replayActive } = useReplay();

  if (!broadcast || !broadcast.teams || broadcast.teams.length < 2) {
    return null;
  }

  if (!showGameComponents && replayActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={broadcast.id} // Ensures animation runs when broadcast updates
        className="scoreboard_box"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.68, -0.55, 0.27, 1.55] }} // Mimics Svelte backInOut
      >
        {broadcast?.top_info_text && (
          <div className="top_bar">{broadcast.top_info_text}</div>
        )}

        <div className="main_bar">
          {broadcast.teams.map((team: any, idx: number) => (
            <ScoreboardTeam key={team.id || idx} team={team} />
          ))}
          <Timer />
        </div>

        <div className="bottom_bar">
          {broadcast.teams.map((team: any, idx: number) => (
            <ScoreboardSeriesBox
              key={team.id || idx}
              team={team}
              seriesNumber={broadcast.series_number}
            />
          ))}
          <ScoreboardGameBox broadcast={broadcast} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Scoreboard;
