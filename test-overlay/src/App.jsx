import React, { useState, useEffect } from "react";
import { Overlay } from "@four-leaf-studios/rl-overlay";
import { mockBroadcastData } from "./mockBroadcast";

/**
 * Build an overlay config from a CSS theme string.
 * Each component in the registry gets its own entry.
 * The CSS is applied to the first component since all CSS
 * gets concatenated into a single <style> block anyway.
 */
const buildOverlay = (css) => ({
  components: [
    {
      id: "scoreboard",
      name: "Scoreboard",
      css: css, // all theme CSS goes here
      code_id: "Scoreboard",
      position: { top: 20, left: 560, width: 800, height: 130 },
    },
    {
      id: "teams",
      name: "Teams",
      css: "",
      code_id: "Teams",
      position: { top: 200, left: 0, width: 350, height: 700 },
    },
    {
      id: "target-player",
      name: "Target Player",
      css: "",
      code_id: "TargetPlayer",
      position: { top: 850, left: 560, width: 800, height: 200 },
    },
    {
      id: "target-boost",
      name: "Target Boost",
      css: "",
      code_id: "TargetBoost",
      position: { top: 750, left: 1700, width: 200, height: 200 },
    },
    {
      id: "replay",
      name: "Replay",
      css: "",
      code_id: "Replay",
      position: { top: 20, left: 860, width: 200, height: 50 },
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
