import /* GameType, */ "@prisma/client";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import ee from "../../eventEmitter";
import { t } from "../../trpc";
import { authedProcedure } from "../utils";
import { getLobby, getLobbies } from "./query";
import * as lobbyState from "./state";
import { GameStateLobby } from "./state";
import { IncomingMessage } from "./type";

enum GameStatus {
  WAITING = "waiting",
  STARTED = "started",
  ENDED = "ended",
}

export const lobbyRouter = t.router({
  list: authedProcedure.query(async () => {
    const lobbies = await getLobbies();

    return lobbies.map((lobby) => lobbyState.extend(lobby, ["players"]));
  }),
  types: authedProcedure.query(async ({ ctx }) => {
    const asd = await ctx.prisma.gameType.findMany({});
    return asd;
  }),
  get: authedProcedure
    .input(
      z.object({
        id: z.number().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const lobby = await getLobby(input.id);

      const lobbyWithState = lobbyState.extend(lobby, ["players"]);

      if (!lobbyState.hasPlayer(input.id, userId)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not in this lobby",
        });
      }

      return lobbyWithState;
    }),
  create: authedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      const lobbyType = await ctx.prisma.gameType.findUnique({
        where: {
          id: input.type,
        },
      });

      if (!lobbyType) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid game type",
        });
      }

      const lobby = await ctx.prisma.lobby.create({
        data: {
          name: input.name,
          ownerId: ctx.user.id,
          status: GameStatus.WAITING,
          gameTypeId: input.type,
        },
        select: {
          id: true,
          name: true,
          gameType: true,
          status: true,
          owner: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

      lobbyState.addPlayer(lobby.id, user);

      ee.emit("onListUpdate", lobby);

      return lobbyState.extend(lobby, ["players"]);
    }),
  join: authedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const { user } = ctx;

      const lobby = await ctx.prisma.lobby.findUnique({
        where: {
          id,
        },
      });

      if (!lobby) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid lobby",
        });
      }

      if (!lobbyState.hasPlayer(lobby.id, user.id)) {
        // throw new TRPCError({
        //   code: "BAD_REQUEST",
        //   message: "You are already in this lobby",
        // });
        lobbyState.addPlayer(lobby.id, user);
      }

      ee.emit(`onUpdate-${lobby.id}`, lobbyState.get(id));
      ee.emit("onListUpdate", lobbyState.get(id, ["players"]));

      return { id };
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

      if (!lobbyState.hasPlayer(lobbyId, user.id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not in this lobby",
        });
      }

      const updatedLobby = lobbyState.removePlayer(lobbyId, user.id);

      ee.emit(`onUpdate-${lobbyId}`, updatedLobby);
      ee.emit("onListUpdate", updatedLobby);

      return { lobbyId };
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
      if (!lobby) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lobby not found",
        });
      }

      if (!lobbyState.hasPlayer(lobbyId, user.id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not in this lobby",
        });
      }

      const messageBody = lobbyState.addMessage(lobbyId, {
        id: Date.now().toString(),
        username: user.username,
        content: input.content,
        timestamp: Date.now(),
      });

      const message = {
        lobbyId: input.lobbyId,
        message: messageBody,
      };

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
      return observable<GameStateLobby>((emit) => {
        const onUpdate = (updatedLobby: GameStateLobby) => {
          const userId = ctx.user.id;

          if (!lobbyState.hasPlayer(updatedLobby.id, userId)) {
            emit.next(updatedLobby);
            emit.complete();
          }

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
      return observable<IncomingMessage>((emit) => {
        const onUpdate = (incomingMessage: IncomingMessage) => {
          const userId = ctx.user.id;

          if (!lobbyState.hasPlayer(incomingMessage.lobbyId, userId)) {
            emit.next(incomingMessage);
            emit.complete();

            return;
          }

          emit.next(incomingMessage);
        };

        ee.on(`onMessage-${input.lobbyId}`, onUpdate);
        return () => {
          ee.off(`onMessage-${input.lobbyId}`, onUpdate);
        };
      });
    }),
  onListUpdate: authedProcedure.subscription(() => {
    return observable<GameStateLobby>((emit) => {
      const onUpdate = (lobby: GameStateLobby) => {
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
