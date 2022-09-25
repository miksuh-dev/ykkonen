import { initTRPC } from "@trpc/server";
// import superjson from "superjson";
// import { ZodError } from "zod";
import { Context } from "./context";

export const t = initTRPC.context<Context>().create({});
