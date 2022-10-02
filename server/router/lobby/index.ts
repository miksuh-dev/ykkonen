import /* GameType, */ "@prisma/client";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import ee from "../../eventEmitter";
import { t } from "../../trpc";
import { authedProcedure } from "../utils";
import { getLobby, getLobbies } from "./query";
import * as lobbyState from "./state";
import { GameStateLobby, Message } from "./state";

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
        lobbyId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { lobbyId } = input;
      const { user } = ctx;

      const lobby = await ctx.prisma.lobby.findUnique({
        where: {
          id: lobbyId,
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
        const players = lobbyState.addPlayer(lobby.id, user);

        ee.emit(`onUpdate-${lobby.id}`, { lobbyId, players });
        ee.emit("onListUpdate", { lobbyId, players });
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

      if (!lobbyState.hasPlayer(lobbyId, user.id)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not in this lobby",
        });
      }

      const players = lobbyState.removePlayer(lobbyId, user.id);

      ee.emit(`onUpdate-${lobbyId}`, { lobbyId, players });
      ee.emit("onListUpdate", { lobbyId, players });

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

      const message = lobbyState.addMessage(lobbyId, {
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
      if (!lobbyState.hasPlayer(input.lobbyId, ctx.user.id)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not in this lobby",
        });
      }

      return observable<GameStateLobby>((emit) => {
        const onUpdate = (updatedLobby: GameStateLobby) => {
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
      if (!lobbyState.hasPlayer(input.lobbyId, ctx.user.id)) {
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
    return observable<GameStateLobby>((emit) => {
      const onListUpdate = (lobby: GameStateLobby) => {
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
