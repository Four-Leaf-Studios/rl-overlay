import React, { type ReactNode } from "react";
import type { OverlayComponentData } from "./types";
type OverlaySlotProps = {
    component: OverlayComponentData;
    children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;
export declare const OverlaySlot: ({ component, children, ...rest }: OverlaySlotProps) => React.JSX.Element;
declare const _default: React.MemoExoticComponent<({ component, children, ...rest }: OverlaySlotProps) => React.JSX.Element>;
export default _default;
