import type { Component } from "solid-js";
import CreateLobby from "components/CreateLobby";
import Center from "components/Center";

const LobbyCreate: Component = () => {
  return (
    <Center>
      <div class="container flex mx-auto justify-center flex-col">
        <div class="flex justify-center flex-col items-center">
          <CreateLobby />
        </div>
      </div>
    </Center>
  );
};

export default LobbyCreate;
