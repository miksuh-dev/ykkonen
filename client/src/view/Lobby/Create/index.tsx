import type { Component } from "solid-js";
import { createResource } from "solid-js";
import { LobbyType } from "trpc/types";
import trpcClient from "trpc";
import LobbyCreate from "components/Lobby/Create";
import Content from "components/Content";

const LobbyCreateView: Component = () => {
  const [types] = createResource<LobbyType[]>(() =>
    trpcClient.lobby.types.query()
  );

  return (
    <Content title={"Luo huone:"}>
      <LobbyCreate types={types} />
    </Content>
  );
};

export default LobbyCreateView;
