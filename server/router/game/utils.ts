import { LobbyStateInternal } from "router/lobby/state";
import { createGame as createSoloGame } from "./solo/state";

export const createGame = (lobbyState: LobbyStateInternal) => {
  switch (lobbyState.gameType.id) {
    case 1:
      return createSoloGame(lobbyState);
  }

  throw new Error("Game type not found");
};
