import type { Component } from "solid-js";
import { createResource } from "solid-js";
import { createEffect, onCleanup } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { Lobby } from "trpc/types";
import trpcClient from "trpc";
import useSnackbar from "hooks/useSnackbar";
import Players from "./Players";
import Chat from "./Chat";

const LobbyViewComponent: Component = () => {
  const params = useParams();
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const [lobby, { mutate }] = createResource<Lobby>(() => {
    if (!params.id) {
      throw new Error("No id");
    }
    return trpcClient.lobby.get.query({ id: params.id });
  });

  createEffect(() => {
    if (!params.id) {
      return;
    }

    const lobbyUpdate = trpcClient.lobby.onUpdate.subscribe(
      { id: params.id },
      {
        onData(updatedLobby) {
          mutate(updatedLobby);
        },
        onError(err) {
          snackbar.error(err.message);
          console.error("error", err);
        },
      }
    );

    onCleanup(() => {
      lobbyUpdate.unsubscribe();
    });
  });

  const onLobbyLeave = async () => {
    try {
      if (!params.id) {
        throw new Error("Not implemented");
      }
      await trpcClient.lobby.leave.mutate({ id: params.id });
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(err.message);
      }
    } finally {
      navigate("/lobby/list");
    }
  };

  const handleSendMessage = (content: string) => {
    if (!params.id) {
      throw new Error("Not implemented");
    }

    return trpcClient.lobby.message.mutate({
      lobbyId: params.id,
      content,
    });
  };

  return (
    <div class="block space-y-4 w-full lg:w-[1000px]">
      <div class="flex flex-row space-x-4">
        <div class="flex-1 bg-white">
          <Players lobby={lobby} />
        </div>
        <div class="flex-1 bg-white">
          <Chat lobby={lobby} sendMessage={handleSendMessage} />
        </div>
      </div>
      <div class="flex flex-row space-x-2">
        <div class="flex-1">
          <button class="btn-primary" onClick={onLobbyLeave}>
            Poistu
          </button>
        </div>
        <button class="btn-primary" onClick={onLobbyLeave}>
          Aloita
        </button>
      </div>
    </div>
  );
};

export default LobbyViewComponent;
