import * as trpc from "@trpc/server";
import { z } from "zod";

interface User {
  id: string;
  username: string;
}

const users: Record<string, User> = {};

export const userRouter = trpc
  .router()
  .query("getUserById", {
    input: z.string(),
    resolve({ input }) {
      return users[input]; // input type is string
    },
  })
  .mutation("login", {
    // validate input with Zod
    input: z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }),
    resolve({ input }) {
      console.log("input", input);
      const id = Date.now().toString();
      const user: User = { id, ...input };
      users[user.id] = user;
      return user;
    },
  })
  .mutation("create", {
    // validate input with Zod
    input: z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }),
    resolve({ input }) {
      const id = Date.now().toString();
      const user: User = { id, ...input };
      users[user.id] = user;
      return user;
    },
  });

export type UserRouter = typeof userRouter;
