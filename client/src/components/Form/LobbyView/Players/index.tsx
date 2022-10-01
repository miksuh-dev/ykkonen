import type { Component } from "solid-js";
import { Resource, Show, For } from "solid-js";
import { LobbyInside } from "trpc/types";

type Props = {
  lobby: Resource<LobbyInside>;
};

const LobbyPlayers: Component<Props> = (props) => {
  console.log("propps.lobby()", props.lobby());
  return (
    <Show
      when={props.lobby()?.players}
      fallback={
        <div class="flex flex-col items-center text-white">Ei pelaajia</div>
      }
    >
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <div class="overflow-hidden ">
            <table class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
              <thead class="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    Pelaajan nimi
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                <For each={props.lobby()?.players}>
                  {(player) => (
                    <tr>
                      <td class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {player.username}
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
};

export default LobbyPlayers;
