import React from "react";
import type { Broadcast, OverlayObject } from "./types";
import "./css/reset.css";
export type OverlayProps = {
    broadcast: Broadcast;
    overlay: OverlayObject;
    preview?: boolean;
    renderSlot?: (comp: OverlayObject["components"][number], Comp: any) => React.ReactNode;
};
export declare const Overlay: {
    ({ broadcast, overlay, preview, renderSlot, }: OverlayProps): React.JSX.Element;
    Scoreboard: () => React.JSX.Element | null;
    Teams: () => React.JSX.Element;
    TargetPlayer: React.MemoExoticComponent<() => React.JSX.Element | null>;
    TargetBoost: React.MemoExoticComponent<() => React.JSX.Element | null>;
    Replay: () => React.JSX.Element | null;
};
export default Overlay;
