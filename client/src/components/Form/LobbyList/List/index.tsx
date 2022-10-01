import { onMount, onCleanup, createResource } from "solid-js";
import type { Component } from "solid-js";
import trpcClient from "trpc";
import { LobbyInList } from "trpc/types";
import useSnackbar from "hooks/useSnackbar";
import { useNavigate } from "@solidjs/router";
import ListLobby from "./List";

const ListLobbyComponent: Component = () => {
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const [lobbies, { mutate }] = createResource<LobbyInList[]>(
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
            if (lobby.id === updatedLobby.id) {
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

  const handleJoinLobby = async (id: number) => {
    try {
      trpcClient.lobby.join.mutate({ id }).then((res) => {
        navigate(`/lobby/${res.id}`);
      });
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(err.message);
      }
    }
  };

  return <ListLobby lobbies={lobbies} onJoin={handleJoinLobby} />;
};

export default ListLobbyComponent;
