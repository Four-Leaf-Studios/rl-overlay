import type { OverlayRule, OverlayComponentConfig, OverlayDataContext, ComponentRuntimeState } from "../types";
export type RuntimeStateMap = Record<string, ComponentRuntimeState>;
export declare function useRuleEngine(rules: OverlayRule[], _components: OverlayComponentConfig[], context: OverlayDataContext): {
    runtimeState: RuntimeStateMap;
    fireEvent: (eventName: string, payload?: unknown) => void;
};
