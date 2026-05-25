import React, { useState, useEffect } from "react";
import { Overlay } from "@four-leaf-studios/rl-overlay";
import { mockBroadcastData } from "./mockBroadcast";

/**
 * Build an overlay config from a CSS theme string.
 * Uses globalCss at the overlay level (not per-component css).
 * Includes new namespaced code_ids and rich renderer components.
 */
const buildOverlay = (css) => ({
  globalCss: css,
  canvas: { width: 1920, height: 1080, background: "transparent" },
  components: [
    // -- Legacy-path compatible components (namespaced code_ids) --
    {
      id: "scoreboard",
      name: "Scoreboard",
      code_id: "builtin.scorebug",
      position: { top: 20, left: 560, width: 800, height: 130 },
    },
    {
      id: "teams",
      name: "Teams",
      code_id: "builtin.team-logo",
      position: { top: 200, left: 0, width: 350, height: 700 },
    },
    {
      id: "timer",
      name: "Timer",
      code_id: "builtin.game-clock",
      position: { top: 20, left: 880, width: 160, height: 60 },
    },
    {
      id: "replay",
      name: "Replay",
      code_id: "builtin.replay-banner",
      position: { top: 20, left: 860, width: 200, height: 50 },
    },
    // -- Rich renderer components (have props → triggers OverlayComponentRenderer) --
    {
      id: "target-player",
      name: "Target Player",
      code_id: "builtin.player-card",
      position: { top: 850, left: 560, width: 800, height: 200 },
      props: {},
    },
    {
      id: "target-boost",
      name: "Target Boost",
      code_id: "builtin.boost-meter",
      position: { top: 750, left: 1700, width: 200, height: 200 },
      props: {},
    },
    {
      id: "goal-popup",
      name: "Goal Popup",
      code_id: "builtin.goal-popup",
      position: { top: 400, left: 760, width: 400, height: 200 },
      props: {
        title: "GOAL!",
        playerName: "Preview Player",
        speed: "120 KPH",
      },
    },
    {
      id: "stat-feed",
      name: "Stat Feed",
      code_id: "builtin.stat-feed",
      position: { top: 600, left: 1560, width: 340, height: 180 },
      props: {
        eventText: "Demolish",
        playerName: "Blue Player",
        targetName: "Orange Player",
      },
    },
  ],
});

export default function App() {
  const [cssText, setCssText] = useState("");

  useEffect(() => {
    fetch("/mock-css.css")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load CSS");
        return res.text();
      })
      .then(setCssText)
      .catch((err) => {
        console.error(err);
        setCssText("");
      });
  }, []);

  if (!cssText) {
    return <div>Loading styles…</div>;
  }

  return (
    <Overlay
      broadcast={mockBroadcastData}
      overlay={buildOverlay(cssText)}
      preview={true}
    />
  );
}
