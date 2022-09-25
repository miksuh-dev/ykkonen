import type { Component } from "solid-js";
import LobbyCreate from "components/Form/LobbyCreate";
import Content from "components/Content";

const LobbyCreateView: Component = () => {
  return (
    <Content title={"Luo huone:"}>
      <LobbyCreate />
    </Content>
  );
};

export default LobbyCreateView;
