import { t } from "../trpc";
import { gameRouter } from "./game";
import { lobbyRouter } from "./lobby";
import { userRouter } from "./user";

// export const baseRouter = t.router({});

export const appRouter = t.mergeRouters(
  t.router({ user: userRouter }),
  t.router({ lobby: lobbyRouter }),
  t.router({ game: gameRouter })
);

export type AppRouter = typeof appRouter;
