import type { Component } from "solid-js";
import { Link } from "@solidjs/router";
import List from "./List";

const ListLobby: Component = () => {
  return (
    <div class="container flex mx-auto justify-center flex-col pt-16 pb-2 md:pb-4 px-2 md:px-0">
      <div class="flex justify-center flex-col items-center">
        <div class="block space-y-4">
          <h1 class="text-4xl font-bold text-center text-white">Huoneet:</h1>
          <List />
          <Link class="btn-primary" href="/lobby/create">
            Luo uusi
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListLobby;
