import type { inferProcedureInput, inferProcedureOutput } from "@trpc/server";
import { inferObservableValue } from "@trpc/server/observable";
import type { AppRouter } from "../../../server/router";

export type LobbyInside = inferProcedureOutput<AppRouter["lobby"]["get"]>;

export type LobbyInList = inferProcedureOutput<
  AppRouter["lobby"]["list"]
>[number];

export type User = inferProcedureOutput<AppRouter["user"]["me"]>;

export type UserLoginInput = inferProcedureInput<AppRouter["user"]["login"]>;

export type UserRegisterInput = inferProcedureInput<
  AppRouter["user"]["register"]
>;

export type LobbyCreateInput = inferProcedureInput<
  AppRouter["lobby"]["create"]
>;

export type GameType = inferProcedureOutput<
  AppRouter["lobby"]["types"]
>[number];

export type IncomingMessage = inferObservableValue<
  inferProcedureOutput<AppRouter["lobby"]["onMessage"]>
>;
