import { LobbyInside } from "trpc/types";
import { RouteDataFuncArgs } from "@solidjs/router";
import { createResource } from "solid-js";
import trpcClient from "trpc";

function LobbyData({ params }: RouteDataFuncArgs) {
  const resource = createResource<LobbyInside>(() => {
    return trpcClient.lobby.get.query({ id: Number(params.id) });
  });

  return resource;
}

export default LobbyData;
