import type { Broadcast } from "../types";
export type CSSJSON = {
    [selector: string]: {
        [prop: string]: string | number;
    };
};
/**
 * Hook that injects both team-color variables (from Broadcast)
 * and optional custom styles (string or JSON) into the document.
 * Uses `@rysh/json-to-css` for JSON → CSS conversion.
 */
export declare function useOverlayStyles(broadcast: Broadcast, styles?: string | CSSJSON): void;
