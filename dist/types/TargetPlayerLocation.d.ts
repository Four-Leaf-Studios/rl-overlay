import React from "react";
import { PlayerState } from "@four-leaf-studios/rl-socket-hook";
type Props = {
    location: PlayerState["location"];
};
export declare const TargetPlayerLocation: ({ location }: Props) => React.JSX.Element;
declare const _default: React.MemoExoticComponent<({ location }: Props) => React.JSX.Element>;
export default _default;
