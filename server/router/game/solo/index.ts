import { t } from "../../../trpc";
import { gameProceduce } from "../../utils";

export const soloRouter = t.router({
  state: gameProceduce.query(({ ctx }) => {
    const { game } = ctx;

    return game.convert(ctx.user.id);
  }),
});

export type SoloRouter = typeof soloRouter;
