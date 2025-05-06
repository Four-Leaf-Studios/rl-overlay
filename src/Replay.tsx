import React from "react";
import useReplay from "./hooks/useReplay";

const Replay = () => {
  const { active: replayActive } = useReplay();

  if (!replayActive) {
    return null;
  }

  return (
    <div className="replay_box">
      <div className="replay_text">Replay</div>
    </div>
  );
};

export default Replay;
