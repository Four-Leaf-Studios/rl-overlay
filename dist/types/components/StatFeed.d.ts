import React from "react";
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
export declare const StatFeed: React.NamedExoticComponent<StatFeedProps>;
export default StatFeed;
