import { createResource } from "solid-js";
import trpcClient from "trpc";
import { SoloGameState } from "trpc/types";

const Solo = () => {
  const [state] = createResource<SoloGameState>(() =>
    trpcClient.game.solo.state.query()
  );

  return <p>Solo</p>;
};

export default Solo;
