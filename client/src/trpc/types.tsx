import type {
  inferProcedureOutput,
  // inferProcedureInput,
} from "@trpc/server";
import type { AppRouter } from "../../../server/router";

export type LobbyInside = inferProcedureOutput<AppRouter["lobby"]["get"]>;

export type LobbyInList = inferProcedureOutput<
  AppRouter["lobby"]["list"]
>[number];

export type User = inferProcedureOutput<AppRouter["user"]["me"]>;

export type LobbyType = inferProcedureOutput<
  AppRouter["lobby"]["types"]
>[number];

// TODO Fix this
export type IncomingMessage = inferProcedureOutput<
  AppRouter["lobby"]["onMessage"]
>;
