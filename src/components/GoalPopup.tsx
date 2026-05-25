import React, { memo } from "react";

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
export const GoalPopup = memo(function GoalPopup({
  title = "GOAL!",
  playerName,
  speed,
  className,
}: GoalPopupProps) {
  return (
    <div
      data-component-id="GoalPopup"
      className={`goal-popup ${className ?? ""}`}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div className="goal-popup__title">{title}</div>
      {playerName && <div className="goal-popup__player">{playerName}</div>}
      {speed !== undefined && speed !== "" && (
        <div className="goal-popup__speed">{speed}</div>
      )}
    </div>
  );
});

export default GoalPopup;
