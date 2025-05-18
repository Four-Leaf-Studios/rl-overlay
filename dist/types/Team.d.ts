import React from "react";
import { Team as TeamType } from "./types";
type Props = {
    id: TeamType["id"];
};
export declare const Team: ({ id }: Props) => React.JSX.Element | null;
declare const MemoizedTeam: React.MemoExoticComponent<({ id }: Props) => React.JSX.Element | null>;
export default MemoizedTeam;
