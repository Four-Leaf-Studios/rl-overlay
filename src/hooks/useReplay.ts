import { useEvent, useEventSelector } from "@four-leaf-studios/rl-socket-hook";

const useReplay = () => {
  const replayEndEvent = useEvent("game:replay_end");
  const replayStartEvent = useEvent("game:replay_start");
  const isReplay = useEventSelector(
    "game:update_state",
    (state) => state?.game?.isReplay
  );

  const disabled = (!replayStartEvent && !isReplay) || replayEndEvent;

  return {
    active: !disabled,
    replayEndEvent,
    replayStartEvent,
    isReplay,
  };
};

export default useReplay;
