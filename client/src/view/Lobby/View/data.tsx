import { IncomingMessage, LobbyInside } from "trpc/types";
import { RouteDataFuncArgs } from "@solidjs/router";
import { onMount, createResource, createSignal, onCleanup } from "solid-js";
import trpcClient from "trpc";
import useSnackbar from "hooks/useSnackbar";

function LobbyData({ params, navigate }: RouteDataFuncArgs) {
  const snackbar = useSnackbar();

  const [lobby, { mutate }] = createResource<LobbyInside>(() =>
    trpcClient.lobby.get.query({
      id: Number(params.id),
    })
  );

  const [messages, setMessages] = createSignal<IncomingMessage[]>([]);

  onMount(() => {
    const lobbyId = Number(params.id);
    if (!lobbyId) throw new Error("Lobby not found");

    const lobbyUpdate = trpcClient.lobby.onUpdate.subscribe(
      { lobbyId },
      {
        onData(updatedLobby) {
          mutate((existingLobby) => {
            if (!existingLobby) return existingLobby;

            return {
              ...existingLobby,
              ...updatedLobby,
            };
          });
        },
        onError(err) {
          snackbar.error(err.message);
          console.error("error", err);
        },
        onComplete() {
          snackbar.success("Poistuttiin huoneesta");
          navigate("/lobby/list");
        },
      }
    );

    onCleanup(() => {
      lobbyUpdate.unsubscribe();
    });
  });

  onMount(() => {
    const lobbyId = Number(params.id);
    if (!lobbyId) throw new Error("Lobby not found");

    const lobbyUpdate = trpcClient.lobby.onMessage.subscribe(
      { lobbyId },
      {
        onData(message) {
          if (lobbyId === message.lobbyId) {
            console.log("new message", message);
            setMessages((messages) => [...messages, message]);
          }
        },
        onError(err) {
          snackbar.error(err.message);
        },
      }
    );

    onCleanup(() => {
      lobbyUpdate.unsubscribe();
    });
  });

  return { lobby, messages };
}

export default LobbyData;
