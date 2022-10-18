import { TRPCError } from "@trpc/server";
import { t } from "../trpc";
import { getLobbyFromPlayer } from "./lobby/state";

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const authedProcedure = t.procedure.use(isAuthed);

const currentGame = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const lobby = getLobbyFromPlayer(ctx.user.id);

  if (!lobby) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not in a lobby",
    });
  }

  if (!lobby.game) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Lobby has no game",
    });
  }

  return next({
    ctx: {
      game: lobby.game,
    },
  });
});

export const gameProceduce = authedProcedure.use(currentGame);
