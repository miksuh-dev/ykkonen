// import { z } from "zod";
import * as trpc from "@trpc/server";
// import { TRPCError } from "@trpc/server";
import { Context } from "../context";
import { lobbyRouter } from "./lobby";
import { userRouter } from "./user";

const createRouter = () => {
  return trpc.router<Context>();
};

export const baseRouter = createRouter();
// .query("hello", {
//   input: z
//     .object({
//       name: z.string(),
//     })
//     .nullish(),
//   resolve: ({ input }) => {
//     console.log("input", input);
//     return {
//       text: `hello ${input?.name ?? "world"}`,
//     };
//   },
// })
// .mutation("createPost", {
//   input: z.object({
//     title: z.string(),
//     text: z.string(),
//   }),
//   resolve({ input }) {
//     // imagine db call here
//     return {
//       id: `${Math.random()}`,
//       ...input,
//     };
//   },
// })
// .subscription("randomNumber", {
//   resolve() {
//     return new trpc.Subscription<{ randomNumber: number; another: string }>(
//       (emit) => {
//         // const timer = setInterval(() => {
//         //   // emits a number every second
//         emit.data({ randomNumber: Math.random(), another: "hello" });
//         // }, 200);
//
//         return () => {
//           // clearInterval(timer);
//         };
//       }
//     );
//   },
// });

export const appRouter = createRouter()
  .merge("base.", baseRouter)
  .merge("user.", userRouter)
  // .middleware(async ({ ctx, next }) => {
  //   if (!ctx.user) {
  //     throw new TRPCError({ code: "UNAUTHORIZED" });
  //   }
  //   return next();
  // })
  .merge("lobby.", lobbyRouter);

export type AppRouter = typeof appRouter;
