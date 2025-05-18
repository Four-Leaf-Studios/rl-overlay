import React from "react";
import { PlayerState } from "@four-leaf-studios/rl-socket-hook";
type Primitive = string | number | boolean;
type PrimitiveKeys<T> = {
    [K in keyof T]: T[K] extends Primitive ? K : never;
}[keyof T];
type StatItemProps<K extends PrimitiveKeys<PlayerState>> = {
    id: K;
    label: string;
    value: PlayerState[K];
};
export declare const StatItem: <K extends PrimitiveKeys<PlayerState>>({ id, label, value, }: StatItemProps<K>) => React.JSX.Element;
export default StatItem;
