import React from "react";
import PlayerBoost from "./PlayerBoost";
import Replay from "./Replay";
import Scoreboard from "./Scoreboard";
import TargetBoost from "./TargetBoost";
import TargetPlayer from "./TargetPlayer";
import Teams from "./Teams";
import Timer from "./Timer";

// Component registry mapping code_id -> React component
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  Scoreboard,
  Teams,
  TargetPlayer,
  TargetBoost,
  Replay,
  Timer,
  PlayerBoost,
};
