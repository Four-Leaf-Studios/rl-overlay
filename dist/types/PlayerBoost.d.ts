import { PlayerState } from "@four-leaf-studios/rl-socket-hook";
import React from "react";
type Props = {
    team: PlayerState["team"];
    boost: PlayerState["boost"];
};
declare const _default: React.MemoExoticComponent<({ team, boost }: Props) => React.JSX.Element>;
export default _default;
