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
  const routeData = useRouteData<RouteData>();

  const handleJoinLobby = async (lobbyId: number) => {
    try {
      trpcClient.lobby.join.mutate({ lobbyId }).then((res) => {
        navigate(`/lobby/${res.lobbyId}`);
      });
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(err.message);
      }
    }
  };

  return <ListLobby lobbyList={routeData.lobbyList} onJoin={handleJoinLobby} />;
};

export default ListLobbyComponent;
