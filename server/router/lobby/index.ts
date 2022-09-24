import * as trpc from "@trpc/server";
import { Context } from "context";
import ee from "../../eventEmitter";
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

export const lobbyRouter = trpc
  .router<Context>()
  .query("list", {
    resolve() {
      return [...lobbies.values()];
    },
  })
  .subscription("list-update", {
    resolve({ ctx }) {
      console.log("ctx", ctx);

      return new trpc.Subscription<{ lobby: Lobby }>((emit) => {
        const onUpdate = (lobby: Lobby) => {
          emit.data({ lobby });
        };

        ee.on("lobby.list-update", onUpdate);

        return () => {
          ee.off("lobby.list-update", onUpdate);
        };
      });
    },
  })
  .mutation("createLobby", {
    input: createLobbySchema,
    resolve({ input, ctx }) {
      const id = Date.now().toString();

      if (!ctx.user) {
        throw new Error("Not authenticated");
      }

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
    },
  });

export type LobbyRouter = typeof lobbyRouter;
