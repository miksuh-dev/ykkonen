import { GameType } from "trpc/types";
import { createResource } from "solid-js";
import trpcClient from "trpc";

function LobbyCreateData() {
  const [types] = createResource<GameType[]>(
    () => trpcClient.lobby.types.query(),
    { initialValue: [] }
  );

  return { types };
}

export default LobbyCreateData;
