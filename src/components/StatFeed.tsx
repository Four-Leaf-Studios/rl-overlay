import React, { memo } from "react";

type StatFeedProps = {
  eventText?: string;
  playerName?: string;
  targetName?: string;
  className?: string;
};

/**
 * Built-in stat feed component (builtin.stat-feed).
 * Displays statfeed events (demolish, save, shot, etc.).
 */
export const StatFeed = memo(function StatFeed({
  eventText,
  playerName,
  targetName,
  className,
}: StatFeedProps) {
  return (
    <div
      data-component-id="StatFeed"
      className={`stat-feed ${className ?? ""}`}
      style={{ width: "100%", height: "100%" }}
    >
      {playerName && <span className="stat-feed__player">{playerName}</span>}
      {eventText && <span className="stat-feed__event">{eventText}</span>}
      {targetName && <span className="stat-feed__target">{targetName}</span>}
    </div>
  );
});

export default StatFeed;
