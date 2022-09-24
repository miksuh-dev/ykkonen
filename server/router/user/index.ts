import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { Context } from "context";
import prisma from "../../prisma";
import { comparePassword, createSession } from "../../utils/auth";
import { loginSchema, createLoginSchema } from "./schema";

export const userRouter = trpc
  .router<Context>()
  .query("me", {
    async resolve({ ctx }) {
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userDataWithoutPassword } = user;

      return userDataWithoutPassword;
    },
  })
  .mutation("login", {
    input: loginSchema,
    async resolve({ input }) {
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (!user) {
        throw new Error("Invalid username or password");
      }

      const passwordsMatch = await comparePassword(
        input.password,
        user.password
      );
      if (!passwordsMatch) {
        throw new Error("Invalid username or password");
      }

      const token = createSession(user);
      return { token };
    },
  })
  .mutation("create", {
    input: createLoginSchema,
    async resolve({ input }) {
      const { username, password } = input;

      const existingUser = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (existingUser) {
        throw new TRPCError({
          message: "The username is already in use",
          code: "BAD_REQUEST",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      const token = createSession(user);

      return { token };
    },
  });

export type UserRouter = typeof userRouter;
