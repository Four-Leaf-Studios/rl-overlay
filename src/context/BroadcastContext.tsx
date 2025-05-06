import React, { createContext, useContext, ReactNode } from "react";
import { Broadcast } from "../types";

const BroadcastContext = createContext<Broadcast | undefined>(undefined);

export const BroadcastProvider: React.FC<{
  broadcast: Broadcast;
  children: ReactNode;
}> = ({ broadcast, children }) => (
  <BroadcastContext.Provider value={broadcast}>
    {children}
  </BroadcastContext.Provider>
);

export function useBroadcast(): Broadcast {
  const ctx = useContext(BroadcastContext);
  if (ctx === undefined) {
    throw new Error("useBroadcast must be used within a BroadcastProvider");
  }
  return ctx;
}
