import React, { ReactNode } from "react";
import type { Broadcast } from "./types";
import { CSSJSON } from "./hooks/useOverlayStyles";
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
export declare const Overlay: {
    ({ broadcast, styles, preview, children, }: OverlayProps): React.JSX.Element;
    Scoreboard: () => React.JSX.Element | null;
    Teams: () => React.JSX.Element;
    TargetPlayer: React.MemoExoticComponent<() => React.JSX.Element | null>;
    TargetBoost: React.MemoExoticComponent<() => React.JSX.Element | null>;
    Replay: () => React.JSX.Element | null;
};
export default Overlay;
