"use client";

import React from "react";
import { RLProvider, WebsocketData } from "@four-leaf-studios/rl-socket-hook";
import { BroadcastProvider } from "./context/BroadcastContext";
import type { Broadcast, OverlayObject } from "./types";

import Scoreboard from "./Scoreboard";
import Teams from "./Teams";
import TargetPlayer from "./TargetPlayer";
import TargetBoost from "./TargetBoost";
import Replay from "./Replay";

import "./css/reset.css";
import { componentRegistry } from "./registry";
import OverlaySlot from "./OverlaySlot";

export type OverlayProps = {
  broadcast: Broadcast;
  overlay: OverlayObject;
  preview?: boolean;
  renderSlot?: (
    comp: OverlayObject["components"][number],
    Comp: any
  ) => React.ReactNode;
};

export const Overlay = ({
  broadcast,
  overlay,
  preview,
  renderSlot,
}: OverlayProps) => {
  const { components } = overlay;

  // Collect CSS into one block
  const cssString = components.map((c) => c.css).join("\n");

  return (
    <BroadcastProvider broadcast={broadcast}>
      <RLProvider>
        <div className="overlay-wrapper">
          {/* Inject all component CSS */}
          <style>{cssString}</style>

          {/* The overlay itself */}
          <div
            className={`overlay ${preview ? "testing" : ""}`}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              aspectRatio: "16/9",
              maxWidth: "1920px",
              maxHeight: "1080px",
              display: "block",
            }}
          >
            {components.map((comp) => {
              const Comp = componentRegistry[comp.code_id];
              if (!Comp) {
                return (
                  <div key={comp.id} style={{ color: "red", fontSize: "14px" }}>
                    Missing component: {comp.code_id}
                  </div>
                );
              }

              if (renderSlot) {
                // delegate to editor if provided
                return renderSlot(comp, Comp);
              }

              // default (non-edit mode)
              return (
                <OverlaySlot key={comp.id} component={comp}>
                  <Comp {...comp} />
                </OverlaySlot>
              );
            })}
          </div>

          {/* Preview data panel on the right */}
          {preview && (
            <div className="testing-data">
              <WebsocketData />
            </div>
          )}
        </div>
      </RLProvider>
    </BroadcastProvider>
  );
};

// expose slots (optional if you want named exports)
Overlay.Scoreboard = Scoreboard;
Overlay.Teams = Teams;
Overlay.TargetPlayer = TargetPlayer;
Overlay.TargetBoost = TargetBoost;
Overlay.Replay = Replay;

export default Overlay;
