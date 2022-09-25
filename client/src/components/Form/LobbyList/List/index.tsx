import { onMount, onCleanup, createResource } from "solid-js";
import type { Component } from "solid-js";
import trpcClient from "trpc";
import { Lobby } from "trpc/types";
import useSnackbar from "hooks/useSnackbar";
import { useNavigate } from "@solidjs/router";
import ListLobby from "./List";

const ListLobbyComponent: Component = () => {
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const [lobbies, { mutate }] = createResource<Lobby[]>(
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
            return [updatedLobby];
          }

          const exists = prev.some((lobby) => lobby.id === updatedLobby.id);
          if (!exists) {
            return [...prev, updatedLobby];
          }

          return prev.map((lobby) => {
            if (lobby.id === updatedLobby.id) {
              return updatedLobby;
            }

            return lobby;
          });
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

  const handleJoinLobby = async (id: string) => {
    try {
      const lobby = await trpcClient.lobby.join.mutate({ id });
      if (!lobby.id) {
        throw new Error("Failed");
      }

      navigate(`/lobby/${lobby.id}`);
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(err.message);
      }
    }
  };

  return <ListLobby lobbies={lobbies} onJoin={handleJoinLobby} />;
};

export default ListLobbyComponent;
