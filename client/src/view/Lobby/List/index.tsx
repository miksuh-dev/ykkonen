import type { Component } from "solid-js";
import LobbyList from "components/Lobby/List";
import Content from "components/Content";

const LobbyListView: Component = () => {
  return (
    <Content title={"Huoneet:"}>
      <LobbyList />
    </Content>
  );
};

export default LobbyListView;
