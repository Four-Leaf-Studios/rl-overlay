import React from "react";
type GoalPopupProps = {
    title?: string;
    playerName?: string;
    speed?: string | number;
    className?: string;
};
/**
 * Built-in goal popup component (builtin.goal-popup).
 * Typically shown via rules when game:goal_scored fires.
 * Styling is managed via CSS classes or styles passed from the overlay engine.
 */
export declare const GoalPopup: React.NamedExoticComponent<GoalPopupProps>;
export default GoalPopup;
