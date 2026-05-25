import React, { type ReactNode } from "react";
import type { OverlayComponentConfig } from "./types";
type OverlaySlotProps = {
    component: OverlayComponentConfig;
    children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;
export declare const OverlaySlot: ({ component, children, ...rest }: OverlaySlotProps) => React.JSX.Element;
declare const _default: React.MemoExoticComponent<({ component, children, ...rest }: OverlaySlotProps) => React.JSX.Element>;
export default _default;
