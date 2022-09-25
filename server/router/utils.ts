import { TRPCError } from "@trpc/server";
import { t } from "../trpc";

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
