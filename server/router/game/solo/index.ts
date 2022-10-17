import { t } from "../../../trpc";
import { authedProcedure } from "../../utils";

export const soloRouter = t.router({
  state: authedProcedure.query(({ ctx }) => {
    const { user } = ctx;

    return user;
  }),
});

export type SoloRouter = typeof soloRouter;
