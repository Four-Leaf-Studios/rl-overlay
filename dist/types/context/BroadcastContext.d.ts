import React, { ReactNode } from "react";
import { Broadcast } from "../types";
export declare const BroadcastProvider: React.FC<{
    broadcast: Broadcast;
    children: ReactNode;
}>;
export declare function useBroadcast(): Broadcast;
