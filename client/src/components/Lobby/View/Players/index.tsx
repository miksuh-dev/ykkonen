import type { Component } from "solid-js";
import { Show, For } from "solid-js";
import { User } from "trpc/types";

type Props = {
  players: User[];
};

const LobbyPlayers: Component<Props> = (props) => {
  return (
    <Show
      when={props.players}
      fallback={
        <div class="flex flex-col items-center text-white">Ei pelaajia</div>
      }
    >
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <div class="overflow-hidden ">
            <table class="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    class="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                  >
                    Pelaajan nimi
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                <For each={props.players}>
                  {(player) => (
                    <tr>
                      <td class="whitespace-nowrap py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
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
