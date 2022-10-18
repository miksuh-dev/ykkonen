import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import ee from "../../eventEmitter";
import { t } from "../../trpc";
import { GameTypes } from "../../type/app";
import { authedProcedure } from "../utils";
import * as lobbyState from "./state";
import { LobbyState, Message } from "./state";
import { GameStatus } from "./types";

export const lobbyRouter = t.router({
  list: authedProcedure.query(() => {
    return lobbyState.getLobbies().map((lobby) => lobby.convert());
  }),
  types: authedProcedure.query(() => {
    return GameTypes;
  }),
  get: authedProcedure
    .input(
      z.object({
        lobbyId: z.number().min(1),
      })
    )
    .query(({ ctx, input }) => {
      const { user } = ctx;

      const lobby = lobbyState.get(input.lobbyId);

      if (!lobby.hasPlayer(user.id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Player not in lobby",
        });
      }
      return lobby.convert();
    }),
  create: authedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.number().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      const { user } = ctx;

      const gameType = GameTypes.find((type) => type.id === input.type);
      if (!gameType) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid game type",
        });
      }

      const lobby = lobbyState
        .createLobby({
          gameType,
          name: input.name,
          ownerId: ctx.user.id,
        })
        .addPlayer(user)
        .convert();

      ee.emit("onListUpdate", lobby);

      return lobby;
    }),
  join: authedProcedure
    .input(
      z.object({
        lobbyId: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { lobbyId } = input;
      const { user } = ctx;

      const lobby = lobbyState.get(lobbyId);

      if (!lobby.hasPlayer(user.id)) {
        const updatedLobby = lobby.addPlayer(user);

        ee.emit(`onUpdate-${lobbyId}`, {
          lobbyId,
          players: updatedLobby.convert().players,
        });
        ee.emit("onListUpdate", {
          lobbyId,
          players: updatedLobby.convert().players,
        });
      }

      return { lobbyId };
    }),
  leave: authedProcedure
    .input(
      z.object({
        lobbyId: z.number().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      const { lobbyId } = input;
      const { user } = ctx;

      const lobby = lobbyState.get(lobbyId);

      if (lobby.hasPlayer(user.id)) {
        const updatedLobby = lobby.removePlayer(user.id);

        ee.emit(`onUpdate-${lobbyId}`, {
          lobbyId,
          players: updatedLobby.convert().players,
        });
        ee.emit("onListUpdate", {
          lobbyId,
          players: updatedLobby.convert().players,
        });
      }

      return { lobbyId };
    }),
  start: authedProcedure
    .input(z.object({ lobbyId: z.number().min(1) }))
    .mutation(({ input, ctx }) => {
      const { user } = ctx;

      const lobby = lobbyState.get(input.lobbyId);

      if (lobby.ownerId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not the owner of this lobby",
        });
      }

      if (lobby.status !== GameStatus.WAITING) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Lobby is not in waiting state",
        });
      }

      const updatedLobby = lobby.startGame();

      ee.emit(`onUpdate-${lobby.id}`, {
        lobbyId: updatedLobby.id,
        status: updatedLobby.status,
      });

      ee.emit("onListUpdate", {
        lobbyId: updatedLobby.id,
        status: updatedLobby.status,
      });

      return updatedLobby.convert();
    }),
  message: authedProcedure
    .input(
      z.object({
        lobbyId: z.number().min(0),
        content: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      const { lobbyId } = input;
      const { user } = ctx;

      const lobby = lobbyState.get(lobbyId);

      if (!lobby.hasPlayer(user.id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not in this lobby",
        });
      }

      const message = lobby.addMessage({
        id: Date.now().toString(),
        username: user.username,
        content: input.content,
        timestamp: Date.now(),
        lobbyId,
      });

      ee.emit(`onMessage-${input.lobbyId}`, message);

      return message;
    }),
  onUpdate: authedProcedure
    .input(
      z.object({
        lobbyId: z.number().min(1),
      })
    )
    .subscription(({ input, ctx }) => {
      const { user } = ctx;
      const { lobbyId } = input;

      const lobby = lobbyState.get(lobbyId);
      if (!lobby.hasPlayer(user.id)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not in this lobby",
        });
      }

      return observable<Partial<LobbyState>>((emit) => {
        const onUpdate = (updatedLobby: Partial<LobbyState>) => {
          emit.next(updatedLobby);
        };

        ee.on(`onUpdate-${input.lobbyId}`, onUpdate);
        return () => {
          ee.off(`onUpdate-${input.lobbyId}`, onUpdate);
        };
      });
    }),
  onMessage: authedProcedure
    .input(
      z.object({
        lobbyId: z.number().min(1),
      })
    )
    .subscription(({ input, ctx }) => {
      const { user } = ctx;
      const { lobbyId } = input;

      const lobby = lobbyState.get(lobbyId);
      if (!lobby.hasPlayer(user.id)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not in this lobby",
        });
      }

      return observable<Message>((emit) => {
        const onMessage = (incomingMessage: Message) => {
          emit.next(incomingMessage);
        };

        ee.on(`onMessage-${input.lobbyId}`, onMessage);
        return () => {
          ee.off(`onMessage-${input.lobbyId}`, onMessage);
        };
      });
    }),
  onListUpdate: authedProcedure.subscription(() => {
    return observable<Partial<LobbyState>>((emit) => {
      const onListUpdate = (lobby: Partial<LobbyState>) => {
        // emit data to client
        emit.next(lobby);
      };

      ee.on("onListUpdate", onListUpdate);
      return () => {
        ee.off("onListUpdate", onListUpdate);
      };
    });
  }),
});

export type LobbyRouter = typeof lobbyRouter;
