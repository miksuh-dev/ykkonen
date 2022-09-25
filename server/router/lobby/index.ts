import { observable } from "@trpc/server/observable";
import ee from "../../eventEmitter";
import { t } from "../../trpc";
import { authedProcedure } from "../utils";
import { createLobbySchema } from "./schema";

interface Player {
  id: string;
  name: string;
}

enum GameStatus {
  WAITING,
  STARTED,
  ENDED,
}

interface Lobby {
  id: string;
  name: string;
  players: Player[];
  status: GameStatus;
  ownerId: number;
}

const lobbies = new Map<string, Lobby>();

export const lobbyRouter = t.router({
  list: authedProcedure.query(() => {
    return [...lobbies.values()];
  }),
  create: authedProcedure
    .input(createLobbySchema)
    .mutation(({ ctx, input }) => {
      const id = Date.now().toString();

      const lobby = {
        id,
        name: input.name,
        ownerId: ctx.user.id,
        players: [],
        status: GameStatus.WAITING,
      };
      lobbies.set(lobby.id, lobby);

      ee.emit("lobby.list-update", lobby);

      return lobby;
    }),
  onListUpdate: t.procedure.subscription(() => {
    return observable<Lobby>((emit) => {
      const onUpdate = (lobby: Lobby) => {
        // emit data to client
        emit.next(lobby);
      };

      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on("updateLobby", onUpdate);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off("updateLobby", onUpdate);
      };
    });
  }),
});

export type LobbyRouter = typeof lobbyRouter;
