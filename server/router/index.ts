// import { z } from "zod";
import * as trpc from "@trpc/server";
import { lobbyRouter } from "./lobby";
import { userRouter } from "./user";

type Context = Record<string, unknown>;

const createRouter = () => {
  return trpc.router<Context>();
};

export const baseRouter = trpc.router<Context>();
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
  .merge("lobby.", lobbyRouter);

export type AppRouter = typeof appRouter;
