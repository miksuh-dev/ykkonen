import { t } from "../trpc";
import { lobbyRouter } from "./lobby";
import { userRouter } from "./user";

// export const baseRouter = t.router({});

export const appRouter = t.mergeRouters(
  t.router({ user: userRouter }),
  t.router({ lobby: lobbyRouter })
);

export type AppRouter = typeof appRouter;
