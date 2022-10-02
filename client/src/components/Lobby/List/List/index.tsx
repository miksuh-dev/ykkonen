import { onMount, onCleanup } from "solid-js";
import type { Component } from "solid-js";
import trpcClient from "trpc";
import useSnackbar from "hooks/useSnackbar";
import { useNavigate, useRouteData } from "@solidjs/router";
import ListLobby from "./List";
import data from "view/Lobby/List/data";

export type RouteData = ReturnType<typeof data>;

const ListLobbyComponent: Component = () => {
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const [lobbies, { mutate }] = useRouteData<RouteData>();

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
