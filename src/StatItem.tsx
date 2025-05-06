// StatItem.tsx
import React from "react";
import { PlayerState } from "@four-leaf-studios/rl-socket-hook";

// 1. Define what “primitive” means for us:
type Primitive = string | number | boolean;

// 2. Extract just the keys whose values are Primitive:
type PrimitiveKeys<T> = {
  [K in keyof T]: T[K] extends Primitive ? K : never;
}[keyof T];

// 3. Now K can only be one of those “safe” keys:
type StatItemProps<K extends PrimitiveKeys<PlayerState>> = {
  id: K;
  label: string;
  value: PlayerState[K]; // guaranteed to be string|number|boolean
};

const StatItem = <K extends PrimitiveKeys<PlayerState>>({
  id,
  label,
  value,
}: StatItemProps<K>) => (
  <li className={`stat_box_statistic stat_box_statistic_player_${id}`}>
    <span className="stat_box_statistic_name">{label}</span>
    <span className="stat_box_statistic_value">{value}</span>
  </li>
);

export default StatItem;
