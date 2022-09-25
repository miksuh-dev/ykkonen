import { observable } from "@trpc/server/observable";
import ee from "../../eventEmitter";
import { t } from "../../trpc";
import { UserWithoutPassword } from "../../type/prisma";
import { authedProcedure } from "../utils";
import {
  createSchema,
  joinSchema,
  getSchema,
  subscribeLobbySchema,
  leaveSchema,
} from "./schema";

type Player = UserWithoutPassword;

enum GameStatus {
  WAITING,
  STARTED,
  ENDED,
}

interface Lobby {
  id: string;
  name: string;
  players: Map<number, Player>;
  status: GameStatus;
  ownerId: number;
}

type LobbyFromClient = Omit<Lobby, "players"> & { players: Player[] };

const lobbies = new Map<string, Lobby>();

const lobbyToClientLobby = (lobby: Lobby): LobbyFromClient => ({
  ...lobby,
  players: Array.from(lobby.players.values()),
});

export const lobbyRouter = t.router({
  list: authedProcedure.query(() => {
    return [...lobbies.values()].map(lobbyToClientLobby);
  }),
  get: authedProcedure.input(getSchema).query(({ input }) => {
    const lobby = lobbies.get(input.id);
    if (!lobby) {
      throw new Error("Lobby not found");
    }

    return lobbyToClientLobby(lobby);
  }),
  create: authedProcedure.input(createSchema).mutation(({ ctx, input }) => {
    const id = Date.now().toString();

    const lobby = {
      id,
      name: input.name,
      ownerId: ctx.user.id,
      players: new Map<number, Player>(),
      status: GameStatus.WAITING,
    } as Lobby;

    lobbies.set(lobby.id, lobby);

    ee.emit("onListUpdate", lobby);

    return lobby;
  }),
  join: authedProcedure.input(joinSchema).mutation(({ ctx, input }) => {
    const { id } = input;
    const { user } = ctx;

    const lobby = lobbies.get(id);
    if (!lobby) {
      throw new Error("Lobby not found");
    }

    if (!lobby.players.has(user.id)) {
      lobby.players.set(user.id, user);
    }

    ee.emit(`onUpdate-${lobby.id}`, lobby);
    ee.emit("onListUpdate", lobby);

    return { id };
  }),
  leave: authedProcedure.input(leaveSchema).mutation(({ ctx, input }) => {
    const { id } = input;
    const { user } = ctx;

    const lobby = lobbies.get(id);
    if (!lobby) {
      throw new Error("Lobby not found");
    }

    if (!lobby.players.has(user.id)) {
      throw new Error("Not in lobby");
    }

    lobby.players.delete(user.id);

    ee.emit(`onUpdate-${lobby.id}`, lobby);
    ee.emit("onListUpdate", lobby);

    return { id };
  }),

  onUpdate: authedProcedure
    .input(subscribeLobbySchema)
    .subscription(({ input, ctx }) => {
      const { user } = ctx;
      //
      const lobby = lobbies.get(input.id);
      if (!lobby) {
        throw new Error("Lobby not found");
      }
      if (!lobby.players.has(user.id)) {
        throw new Error("Not in lobby");
      }

      return observable<LobbyFromClient>((emit) => {
        const onUpdate = (updatedLobby: Lobby) => {
          emit.next(lobbyToClientLobby(updatedLobby));
        };

        ee.on(`onUpdate-${input.id}`, onUpdate);
        return () => {
          ee.off(`onUpdate-${input.id}`, onUpdate);
        };
      });
    }),
  onListUpdate: authedProcedure.subscription(() => {
    return observable<Lobby>((emit) => {
      const onUpdate = (lobby: Lobby) => {
        // emit data to client
        emit.next(lobby);
      };

      ee.on("onListUpdate", onUpdate);
      return () => {
        ee.off("onListUpdate", onUpdate);
      };
    });
  }),
});

export type LobbyRouter = typeof lobbyRouter;
