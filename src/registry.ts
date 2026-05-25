import React from "react";
import PlayerBoost from "./PlayerBoost";
import Replay from "./Replay";
import Scoreboard from "./Scoreboard";
import TargetBoost from "./TargetBoost";
import TargetPlayer from "./TargetPlayer";
import Teams from "./Teams";
import Timer from "./Timer";
import GoalPopup from "./components/GoalPopup";
import StatFeed from "./components/StatFeed";

// Component registry mapping code_id -> React component
export const componentRegistry: Record<string, React.ComponentType<any>> = {
  // Legacy code_id values (backward-compatible)
  Scoreboard,
  Teams,
  TargetPlayer,
  TargetBoost,
  Replay,
  Timer,
  PlayerBoost,

  // Built-in overlay components (new namespaced code_ids)
  "builtin.scorebug": Scoreboard,
  "builtin.team-logo": Teams,
  "builtin.game-clock": Timer,
  "builtin.goal-popup": GoalPopup,
  "builtin.replay-banner": Replay,
  "builtin.stat-feed": StatFeed,
  "builtin.player-card": TargetPlayer,
  "builtin.boost-meter": TargetBoost,
};
