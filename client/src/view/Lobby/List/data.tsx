import { LobbyInList } from "trpc/types";
import { createResource, onCleanup, onMount } from "solid-js";
import trpcClient from "trpc";
import useSnackbar from "hooks/useSnackbar";

function LobbyData() {
  const snackbar = useSnackbar();

  const [lobbyList, { mutate }] = createResource<LobbyInList[]>(
    () => trpcClient.lobby.list.query(),
    {
      initialValue: [],
    }
  );

  onMount(() => {
    const listUpdate = trpcClient.lobby.onListUpdate.subscribe(undefined, {
      onData(updatedLobby) {
        mutate((prev) => {
          if (!prev) {
            return prev;
          }

          return prev.map((lobby) => {
            if (lobby.id === updatedLobby.lobbyId) {
              return { ...lobby, ...updatedLobby };
            }
            return lobby;
          });
        });
      },
      onError(err) {
        console.error("error", err);
        snackbar.error(err.message);
      },
    });

    onCleanup(() => {
      listUpdate.unsubscribe();
    });
  });

  return { lobbyList };
}

export default LobbyData;
