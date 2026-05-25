import React from "react";
import type { Broadcast, OverlayObject, OverlayComponentConfig } from "./types";
import "./css/reset.css";
export type OverlayProps = {
    broadcast: Broadcast;
    overlay: OverlayObject;
    preview?: boolean;
    /** Optional mock SOS event to inject (for editor preview) */
    mockEvent?: {
        name: string;
        payload?: unknown;
    } | null;
    renderSlot?: (comp: OverlayComponentConfig, Comp: React.ComponentType<any>) => React.ReactNode;
};
export declare const Overlay: {
    ({ broadcast, overlay, preview, mockEvent, renderSlot, }: OverlayProps): React.JSX.Element;
    Scoreboard: () => React.JSX.Element | null;
    Teams: () => React.JSX.Element;
    TargetPlayer: React.MemoExoticComponent<() => React.JSX.Element | null>;
    TargetBoost: React.MemoExoticComponent<() => React.JSX.Element | null>;
    Replay: () => React.JSX.Element | null;
};
export default Overlay;
