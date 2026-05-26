import React from "react";
import type { OverlayDataContext } from "../types";
/**
 * Hook that builds a normalized OverlayDataContext from rl-socket-hook.
 * Must be called inside an RLProvider.
 */
export declare function useNormalizedGameState(broadcast?: unknown): OverlayDataContext;
export declare const GameStateProvider: React.FC<{
    children: React.ReactNode;
    broadcast?: unknown;
    /** When provided, overrides the live WebSocket state (for editor preview). */
    mockState?: OverlayDataContext;
}>;
export declare function useGameState(): OverlayDataContext;
