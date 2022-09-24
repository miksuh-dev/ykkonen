import type { Component } from "solid-js";
import CreateLobby from "components/CreateLobby";

const Lobby: Component = () => {
  return (
    <div class="container flex mx-auto justify-center flex-col">
      <div class="flex justify-center flex-col items-center">
        <CreateLobby />
      </div>
    </div>
  );
};

export default Lobby;
