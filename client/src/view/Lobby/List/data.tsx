import { LobbyInList } from "trpc/types";
import { createResource } from "solid-js";
import trpcClient from "trpc";

function LobbyData() {
  const resource = createResource<LobbyInList[]>(
    () => trpcClient.lobby.list.query(),
    {
      initialValue: [],
    }
  );

  return resource;
}

export default LobbyData;
