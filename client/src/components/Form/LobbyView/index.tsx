import type { Component } from "solid-js";
import { createResource } from "solid-js";
import { createEffect, onCleanup } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { Lobby } from "trpc/types";
import trpcClient from "trpc";
import useSnackbar from "hooks/useSnackbar";
import Players from "./Players";

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

  return (
    <div class="block space-y-4">
      <Players lobby={lobby} />
      <button class="btn-primary w-full" onClick={onLobbyLeave}>
        Poistu
      </button>
    </div>
  );
};

export default LobbyViewComponent;
