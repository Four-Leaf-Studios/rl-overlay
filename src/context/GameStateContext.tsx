"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useEventSelector, useEvent } from "@four-leaf-studios/rl-socket-hook";
import type { OverlayDataContext } from "../types";

const INITIAL_CONTEXT: OverlayDataContext = {
  game: { hasGame: false, teams: {} },
  players: {},
  event: { last: null },
};

const GameStateContext = createContext<OverlayDataContext>(INITIAL_CONTEXT);

/**
 * Hook that builds a normalized OverlayDataContext from rl-socket-hook.
 * Must be called inside an RLProvider.
 */
export function useNormalizedGameState(
  broadcast?: unknown,
): OverlayDataContext {
  const updateState = useEventSelector(
    "game:update_state",
    (state: unknown) => state,
  );
  const goalScoredEvent = useEvent("game:goal_scored");
  const ballHitEvent = useEvent("game:ball_hit");
  const statfeedEvent = useEvent("game:statfeed_event");
  const matchEndedEvent = useEvent("game:match_ended");
  const replayStart = useEvent("game:replay_start");
  const replayEnd = useEvent("game:replay_end");

  return useMemo(() => {
    const raw = updateState as Record<string, unknown> | null;
    const game = (raw?.game as Record<string, unknown>) ?? {};
    const players = (raw?.players as Record<string, unknown>) ?? {};

    const lastEventName = goalScoredEvent
      ? "game:goal_scored"
      : statfeedEvent
        ? "game:statfeed_event"
        : ballHitEvent
          ? "game:ball_hit"
          : matchEndedEvent
            ? "game:match_ended"
            : null;

    return {
      game: {
        arena: game.arena as string | undefined,
        hasGame: Boolean(game.hasGame),
        hasTarget: game.hasTarget as boolean | undefined,
        hasWinner: game.hasWinner as boolean | undefined,
        isOT: game.isOT as boolean | undefined,
        isReplay: Boolean(replayStart) && !replayEnd,
        target: game.target as string | undefined,
        time: game.time as number | undefined,
        winner: game.winner as string | undefined,
        ball: game.ball as OverlayDataContext["game"]["ball"],
        teams: (game.teams as OverlayDataContext["game"]["teams"]) ?? {},
      },
      players,
      event: {
        last: lastEventName
          ? {
              name: lastEventName,
              payload:
                goalScoredEvent ??
                statfeedEvent ??
                ballHitEvent ??
                matchEndedEvent,
              receivedAt: Date.now(),
            }
          : null,
        goalScored: goalScoredEvent ?? undefined,
        ballHit: ballHitEvent ?? undefined,
        statfeed: statfeedEvent ?? undefined,
        matchEnded: matchEndedEvent ?? undefined,
      },
      broadcast,
    };
  }, [
    updateState,
    goalScoredEvent,
    ballHitEvent,
    statfeedEvent,
    matchEndedEvent,
    replayStart,
    replayEnd,
    broadcast,
  ]);
}

export const GameStateProvider: React.FC<{
  children: React.ReactNode;
  broadcast?: unknown;
  /** When provided, overrides the live WebSocket state (for editor preview). */
  mockState?: OverlayDataContext;
}> = ({ children, broadcast, mockState }) => {
  const liveState = useNormalizedGameState(broadcast);
  const state = mockState ?? liveState;
  return (
    <GameStateContext.Provider value={state}>
      {children}
    </GameStateContext.Provider>
  );
};

export function useGameState(): OverlayDataContext {
  return useContext(GameStateContext);
}
