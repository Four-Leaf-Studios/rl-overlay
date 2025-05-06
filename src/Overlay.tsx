// src/Overlay.tsx
"use client";

import React, { ReactNode } from "react";
import { RLProvider, WebsocketData } from "@four-leaf-studios/rl-socket-hook";
import { BroadcastProvider } from "./context/BroadcastContext";
import type { Broadcast } from "./types";

import Scoreboard from "./Scoreboard";
import Teams from "./Teams";
import TargetPlayer from "./TargetPlayer";
import TargetBoost from "./TargetBoost";
import Replay from "./Replay";

import { useOverlayStyles, CSSJSON } from "./hooks/useOverlayStyles";
import "./css/reset.css";

export type OverlayProps = {
  broadcast: Broadcast;
  /**
   * Either:
   * - a raw CSS string, or
   * - a JSON map of CSS rules
   */
  styles?: string | CSSJSON;
  children?: ReactNode;
  preview?: boolean;
};

export const Overlay = ({
  broadcast,
  styles,
  preview,
  children,
}: OverlayProps) => {
  useOverlayStyles(broadcast, styles);

  return (
    <BroadcastProvider broadcast={broadcast}>
      <RLProvider>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
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
            {children ?? (
              <>
                <Scoreboard />
                <Teams />
                <TargetPlayer />
                <TargetBoost />
                <Replay />
              </>
            )}
          </div>

          {/* Preview data panel on the right */}
          {preview && (
            <div
              className="testing-data"
              style={{
                flexGrow: 1,
                marginLeft: "1rem",
                overflowY: "auto",
                backgroundColor: "rgba(0,0,0,0.8)",
                color: "#black",
                fontFamily: "monospace",
                maxHeight: "1080px",
              }}
            >
              <WebsocketData />
            </div>
          )}
        </div>
      </RLProvider>
    </BroadcastProvider>
  );
};

// expose slots
Overlay.Scoreboard = Scoreboard;
Overlay.Teams = Teams;
Overlay.TargetPlayer = TargetPlayer;
Overlay.TargetBoost = TargetBoost;
Overlay.Replay = Replay;

export default Overlay;
