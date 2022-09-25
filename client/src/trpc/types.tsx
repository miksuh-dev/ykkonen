import type {
  inferProcedureOutput,
  // inferProcedureInput,
  // inferSubscriptionOutput,
} from "@trpc/server";
import type { AppRouter } from "../../../server/router";

export type Lobby = inferProcedureOutput<AppRouter["lobby"]["list"]>[number];
export type User = inferProcedureOutput<AppRouter["user"]["me"]>;
