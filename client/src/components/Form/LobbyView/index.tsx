import type { Component } from "solid-js";
import { createResource, Show } from "solid-js";
import { createEffect, onCleanup } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { LobbyInside } from "trpc/types";
import trpcClient from "trpc";
import useSnackbar from "hooks/useSnackbar";
import Players from "./Players";
import Chat from "./Chat";

const LobbyViewComponent: Component = () => {
  const params = useParams();
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const [lobby, { mutate }] = createResource<LobbyInside>(() => {
    if (params.id === undefined) {
      throw new Error("No id");
    }

    return trpcClient.lobby.get.query({ id: Number(params.id) });
  });

  createEffect(() => {
    const lobbyId = lobby()?.id;
    if (!lobbyId) {
      return;
    }

    const lobbyUpdate = trpcClient.lobby.onUpdate.subscribe(
      { lobbyId },
      {
        onData(updatedLobby) {
          console.log("data", updatedLobby);
          mutate((existingLobby) => {
            if (!existingLobby) {
              return existingLobby;
            }
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

  const onLobbyLeave = async () => {
    try {
      const lobbyId = lobby()?.id;
      if (!lobbyId) {
        return;
      }

      await trpcClient.lobby.leave.mutate({ lobbyId });
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(err.message);
      }
    }
  };

  return (
    <div class="block space-y-4 w-full lg:w-[1000px]">
      <div class="flex flex-row space-x-4">
        <div class="flex-1 bg-white">
          <Players lobby={lobby} />
        </div>
        <div class="flex-1 bg-white">
          <Show when={lobby()}>
            <Chat lobby={lobby} />
          </Show>
        </div>
      </div>
      <div class="flex flex-row space-x-2">
        <div class="flex-1">
          <button class="btn-primary" onClick={onLobbyLeave}>
            Poistu
          </button>
        </div>
        <button class="btn-primary">Aloita</button>
      </div>
    </div>
  );
};

export default LobbyViewComponent;
