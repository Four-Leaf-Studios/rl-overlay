import { useEventSelector } from "@four-leaf-studios/rl-socket-hook";

const useTargetPlayer = () => {
  const targetPlayer = useEventSelector("game:update_state", (state) => {
    if (!state?.game.hasTarget) return null;

    const target = state?.game?.target;

    if (!state?.players || !target) return null;

    const player = Object.values(state?.players)?.find(
      (player) => player.id === target
    );

    return player;
  });

  return targetPlayer;
};

export default useTargetPlayer;
