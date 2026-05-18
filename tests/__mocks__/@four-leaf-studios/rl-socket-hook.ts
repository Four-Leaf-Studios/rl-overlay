import { vi } from "vitest";
import React from "react";

// Mock the rl-socket-hook module
export const useEventSelector = vi.fn(() => null);
export const useEvent = vi.fn(() => null);
export const RLProvider = ({ children }: { children: React.ReactNode }) =>
  React.createElement("div", { "data-testid": "rl-provider" }, children);
export const WebsocketData = () =>
  React.createElement("div", { "data-testid": "websocket-data" });
