import * as trpc from "@trpc/server";
import { z } from "zod";

interface User {
  id: string;
  name: string;
  bio?: string;
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
  .mutation("createUser", {
    // validate input with Zod
    input: z.object({
      name: z.string().min(1),
      bio: z.string().max(142).optional(),
    }),
    resolve({ input }) {
      const id = Date.now().toString();
      const user: User = { id, ...input };
      users[user.id] = user;
      return user;
    },
  });

export type UserRouter = typeof userRouter;
