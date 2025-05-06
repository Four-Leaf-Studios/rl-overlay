import React from "react";
import { Team } from "./types";
type Props = {
    id: Team["id"];
};
declare const Team: ({ id }: Props) => React.JSX.Element | null;
declare const MemoizedTeam: React.MemoExoticComponent<({ id }: Props) => React.JSX.Element | null>;
export default MemoizedTeam;
