import type { Component } from "solid-js";
import LobbyView from "components/Form/LobbyView";
import Content from "components/Content";

const LobbyViewView: Component = () => {
  return (
    <Content title={"Huone:"}>
      <LobbyView />
    </Content>
  );
};

export default LobbyViewView;
