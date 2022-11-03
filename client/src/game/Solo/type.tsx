import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "../../../../server/router";

export type GameState = inferProcedureOutput<
  AppRouter["game"]["solo"]["state"]
>;

export type Card = GameState["centerCard"];
export type CardImage = NonNullable<Card["image"]>;
