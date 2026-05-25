import React from "react";
import type { OverlayComponentConfig, OverlayDataContext, ComponentRuntimeState } from "../types";
type Props = {
    component: OverlayComponentConfig;
    context: OverlayDataContext;
    runtimeState?: ComponentRuntimeState;
};
export declare const OverlayComponentRenderer: React.NamedExoticComponent<Props>;
export default OverlayComponentRenderer;
