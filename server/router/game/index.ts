import { t } from "../../trpc";
import { soloRouter } from "./solo";

export const gameRouter = t.mergeRouters(t.router({ solo: soloRouter }));

export type GameRouter = typeof gameRouter;
