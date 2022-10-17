import { For, Show } from "solid-js";
import type { Component } from "solid-js";

import { RouteData } from "./index";

type Props = {
  lobbyList: RouteData["lobbyList"];
  onJoin: (id: number) => void;
};

const ListLobby: Component<Props> = (props) => (
  <Show
    when={props.lobbyList()?.length}
    fallback={
      <div class="flex flex-col items-center text-white">
        Ei aktiivisia huoneita
      </div>
    }
  >
    <div class="overflow-x-auto shadow-md sm:rounded-lg">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden ">
          <table class="block h-[500px] min-w-full table-fixed divide-y divide-gray-200 overflow-y-auto bg-white dark:divide-gray-700">
            <thead class="sticky top-0 bg-gray-100 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  class="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                >
                  Huoneen nimi
                </th>
                <th
                  scope="col"
                  class="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                >
                  Pelaajia huoneessa
                </th>
                <th
                  scope="col"
                  class="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                >
                  Tyyppi
                </th>
                <th
                  scope="col"
                  class="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                >
                  Tila
                </th>
                <th scope="col" class="p-4">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              <For each={props.lobbyList()}>
                {(lobby) => (
                  <tr>
                    <td class="whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                      {lobby.name}
                    </td>
                    <td class="whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-500 dark:text-white">
                      {lobby.players.length}
                    </td>
                    <td class="whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                      {lobby.gameType.name}
                    </td>
                    <td class="whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                      {lobby.status}
                    </td>
                    <td class="whitespace-nowrap py-4 px-6 text-right text-sm font-medium">
                      <button
                        class="text-blue-600 hover:underline dark:text-blue-500"
                        onClick={() => props.onJoin(lobby.id)}
                      >
                        Liity
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Show>
);

export default ListLobby;
