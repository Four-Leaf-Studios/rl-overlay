import { useEvent, useEventSelector } from "@four-leaf-studios/rl-socket-hook";

const useShowGameComponents = () => {
  const gameInitialized = useEvent("game:initialized");
  const matchDestroyed = useEvent("game:match_destroyed");
  const hasGame = useEventSelector(
    "game:update_state",
    (state) => state?.hasGame
  );

  return !!gameInitialized && !!hasGame && !matchDestroyed;
};

export default useShowGameComponents;
