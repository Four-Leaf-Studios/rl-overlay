"use client";

import React, { useMemo } from "react";
import { RLProvider, WebsocketData } from "@four-leaf-studios/rl-socket-hook";
import { BroadcastProvider } from "./context/BroadcastContext";
import { GameStateProvider, useGameState } from "./context/GameStateContext";
import { useRuleEngine } from "./rules/ruleEngine";
import type { Broadcast, OverlayObject, OverlayComponentConfig } from "./types";
import { useOverlayStyles } from "./hooks/useOverlayStyles";

import Scoreboard from "./Scoreboard";
import Teams from "./Teams";
import TargetPlayer from "./TargetPlayer";
import TargetBoost from "./TargetBoost";
import Replay from "./Replay";

import "./css/reset.css";
import { componentRegistry } from "./registry";
import OverlaySlot from "./OverlaySlot";
import OverlayComponentRenderer from "./components/OverlayComponentRenderer";

export type OverlayProps = {
  broadcast: Broadcast;
  overlay: OverlayObject;
  preview?: boolean;
  /** Optional mock SOS event to inject (for editor preview) */
  mockEvent?: { name: string; payload?: unknown } | null;
  renderSlot?: (
    comp: OverlayComponentConfig,
    Comp: React.ComponentType<any>,
  ) => React.ReactNode;
};

/** Inner component: runs inside RLProvider so hooks can use socket context */
function OverlayInner({
  broadcast,
  overlay,
  preview,
  mockEvent,
  renderSlot,
}: OverlayProps) {
  const components = overlay.components ?? [];
  const rules = overlay.rules ?? [];
  const canvas = overlay.canvas;
  const globalCss = overlay.globalCss ?? overlay.css ?? "";

  // Inject team color CSS variables
  useOverlayStyles(broadcast);

  // Normalized game state from SOS socket
  const gameContext = useGameState();

  // Rule engine
  const { runtimeState } = useRuleEngine(rules, components, gameContext);

  // Per-component CSS collected for legacy style injection
  const legacyCssString = components.map((c) => c.css ?? "").join("\n");

  // Canvas background style
  const canvasStyle: React.CSSProperties = useMemo(() => {
    const base: React.CSSProperties = {
      position: "relative",
      width: "100%",
      height: "100%",
      aspectRatio: "16/9",
      maxWidth: canvas?.width ?? "1920px",
      maxHeight: canvas?.height ?? "1080px",
      display: "block",
    };
    if (canvas?.background && canvas.background !== "transparent") {
      base.background = canvas.background;
    }
    return base;
  }, [canvas]);

  // Determine if we use the richer renderer (has rules or rich props/states)
  const useRichRenderer =
    rules.length > 0 ||
    components.some(
      (c) =>
        c.states !== undefined ||
        c.props !== undefined ||
        c.html !== undefined ||
        c.enabled === false,
    );

  return (
    <div className="overlay-wrapper">
      {/* Global/component CSS */}
      {globalCss && <style>{globalCss}</style>}
      <style>{legacyCssString}</style>

      <div
        className={`overlay ${preview ? "testing" : ""}`}
        style={canvasStyle}
      >
        {useRichRenderer
          ? // Rich renderer: uses OverlayComponentRenderer with rule engine state
            [...components]
              .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
              .map((comp) => (
                <OverlayComponentRenderer
                  key={comp.id}
                  component={comp}
                  context={gameContext}
                  runtimeState={runtimeState[comp.id]}
                />
              ))
          : // Legacy renderer: uses OverlaySlot + componentRegistry directly
            components.map((comp) => {
              const Comp = componentRegistry[comp.code_id];
              if (!Comp) {
                return (
                  <div key={comp.id} style={{ color: "red", fontSize: "14px" }}>
                    Missing component: {comp.code_id}
                  </div>
                );
              }
              if (renderSlot) {
                return renderSlot(comp, Comp);
              }
              return (
                <OverlaySlot key={comp.id} component={comp}>
                  <Comp {...comp} />
                </OverlaySlot>
              );
            })}
      </div>

      {preview && (
        <div className="testing-data">
          <WebsocketData />
        </div>
      )}
    </div>
  );
}

export const Overlay = ({
  broadcast,
  overlay,
  preview,
  mockEvent,
  renderSlot,
}: OverlayProps) => {
  useOverlayStyles(broadcast);

  return (
    <BroadcastProvider broadcast={broadcast}>
      <RLProvider>
        <GameStateProvider broadcast={broadcast}>
          <OverlayInner
            broadcast={broadcast}
            overlay={overlay}
            preview={preview}
            mockEvent={mockEvent}
            renderSlot={renderSlot}
          />
        </GameStateProvider>
      </RLProvider>
    </BroadcastProvider>
  );
};

// Named sub-components for convenience
Overlay.Scoreboard = Scoreboard;
Overlay.Teams = Teams;
Overlay.TargetPlayer = TargetPlayer;
Overlay.TargetBoost = TargetBoost;
Overlay.Replay = Replay;

export default Overlay;
