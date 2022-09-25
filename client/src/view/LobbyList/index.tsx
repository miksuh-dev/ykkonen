import type { Component } from "solid-js";
import ListLobby from "components/Form/LobbyList";
import Center from "components/Center";

const LobbyList: Component = () => {
  return (
    <Center>
      <div class="container flex mx-auto justify-center flex-col">
        <div class="flex justify-center flex-col items-center">
          <ListLobby />
        </div>
      </div>
    </Center>
  );
};

export default LobbyList;
