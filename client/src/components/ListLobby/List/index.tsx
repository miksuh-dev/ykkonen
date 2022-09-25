import { createSignal, onMount, onCleanup, For, Show } from "solid-js";
import type { Component } from "solid-js";
import trpcClient from "trpc";
import { Lobby } from "trpc/types";
import useSnackbar from "hooks/useSnackbar";

const ListLobby: Component = () => {
  const [lobbies, setLobbies] = createSignal<Lobby[]>([]);
  const snackbar = useSnackbar();

  onMount(() => {
    trpcClient.lobby.list.query().then((data) => {
      setLobbies(data);
    });

    const listUpdate = trpcClient.lobby.onListUpdate.subscribe(undefined, {
      onData(updatedLobby) {
        setLobbies((prev) => {
          if (prev.some((lobby) => lobby.id === updatedLobby.id)) {
            return prev.map((lobby) => {
              if (lobby.id === updatedLobby.id) {
                return updatedLobby;
              }

              return lobby;
            });
          }

          return [...prev, updatedLobby];
        });
      },
      onError(err) {
        snackbar.error(err.message);
        console.error("error", err);
      },
    });

    onCleanup(() => {
      listUpdate.unsubscribe();
    });
  });

  const handleJoinLobby = (id: string) => {
    console.log("id", id);
    // trpcClient.mutation("lobby.join", { id });
  };

  return (
    <Show
      when={lobbies().length > 0}
      fallback={
        <div class="flex flex-col items-center text-white">
          Ei aktiivisia huoneita
        </div>
      }
    >
      <div class="max-w-2xl mx-auto">
        <div class="flex flex-col">
          <div class="overflow-x-auto shadow-md sm:rounded-lg">
            <div class="inline-block min-w-full align-middle">
              <div class="overflow-hidden ">
                <table class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                  <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                      >
                        Huoneen nimi
                      </th>
                      <th
                        scope="col"
                        class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                      >
                        Pelaajia huoneessa
                      </th>
                      <th
                        scope="col"
                        class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                      >
                        Tila
                      </th>
                      <th scope="col" class="p-4">
                        <span class="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    <For each={lobbies()}>
                      {(lobby) => (
                        <tr>
                          <td class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {lobby.name}
                          </td>
                          <td class="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">
                            {lobby.players.length}
                          </td>
                          <td class="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {lobby.status}
                          </td>
                          <td class="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                            <button
                              class="text-blue-600 dark:text-blue-500 hover:underline"
                              onClick={() => handleJoinLobby(lobby.id)}
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
        </div>
      </div>
    </Show>
  );
};

export default ListLobby;
