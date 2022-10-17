import { Component } from "solid-js";
import { useNavigate, useParams, useRouteData } from "@solidjs/router";
import trpcClient from "trpc";
import useSnackbar from "hooks/useSnackbar";
import Players from "./Players";
import Chat from "./Chat";
import data from "view/Lobby/View/data";

export type RouteData = ReturnType<typeof data>;

const LobbyViewComponent: Component = () => {
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const routeData = useRouteData<RouteData>();
  const params = useParams();

  const handleLobbyLeave = async () => {
    try {
      const lobbyId = Number(params.id);
      if (lobbyId) {
        await trpcClient.lobby.leave.mutate({ lobbyId });
      }
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(err.message);
      }
    } finally {
      navigate("/lobby/list");
    }
  };

  const handleLobbyStart = async () => {
    try {
      const lobbyId = Number(params.id);
      if (lobbyId) {
        await trpcClient.lobby.start.mutate({ lobbyId });
      }
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(err.message);
      }
    }
  };

  return (
    <div class="block w-full space-y-4 lg:w-[1000px]">
      <div class="flex flex-row space-x-4">
        <div class="flex-1 bg-white">
          <Players players={routeData.lobby()?.players || []} />
        </div>
        <div class="flex-1 bg-white">
          <Chat messages={routeData.messages} />
        </div>
      </div>
      <div class="flex flex-row space-x-2">
        <div class="flex-1">
          <button class="btn-primary" onClick={handleLobbyLeave}>
            Poistu
          </button>
        </div>
        <button class="btn-primary" onClick={handleLobbyStart}>
          Aloita
        </button>
      </div>
    </div>
  );
};

export default LobbyViewComponent;
