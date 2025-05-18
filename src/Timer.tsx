import { useEventSelector } from "@four-leaf-studios/rl-socket-hook";
import React from "react";
import { memo } from "react";

const TimerComponent: React.FC = () => {
  // Add proper null checks to prevent "Cannot read properties of undefined" error
  const time_seconds = useEventSelector(
    "game:update_state",
    (state) => state?.game?.time_seconds
  );

  // Return null if time_seconds is not available
  if (typeof time_seconds !== "number") return null;

  const minutes = Math.floor(time_seconds / 60);
  const seconds = time_seconds % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return <span className="time_box">{formattedTime}</span>;
};

export const Timer = memo(TimerComponent);
Timer.displayName = "Timer";
export default Timer;
