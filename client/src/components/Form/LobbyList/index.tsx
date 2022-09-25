import type { Component } from "solid-js";
import { Link } from "@solidjs/router";
import List from "./List";

const ListLobby: Component = () => {
  return (
    <div class="block space-y-4">
      <List />
      <div class="flex flex-row space-x-2">
        <Link class="btn-primary" href="/lobby/create">
          Luo uusi
        </Link>
      </div>
    </div>
  );
};

export default ListLobby;
