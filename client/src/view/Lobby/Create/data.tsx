import { GameType } from "trpc/types";
import { createResource } from "solid-js";
import trpcClient from "trpc";

function LobbyCreateData() {
  const resource = createResource<GameType[]>(
    () => trpcClient.lobby.types.query(),
    { initialValue: [] }
  );

  return resource;
}

export default LobbyCreateData;
