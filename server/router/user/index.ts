import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import prisma from "../../prisma";
import { t } from "../../trpc";
import { comparePassword, createSession } from "../../utils/auth";
import { authedProcedure } from "../utils";
import { loginSchema, createSchema } from "./schema";

export const userRouter = t.router({
  me: authedProcedure.query(({ ctx }) => {
    const { user } = ctx;

    return user;
  }),
  login: t.procedure.input(loginSchema).mutation(async ({ input }) => {
    const user = await prisma.user.findUnique({
      where: {
        username: input.username,
      },
    });

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const passwordsMatch = await comparePassword(input.password, user.password);
    if (!passwordsMatch) {
      throw new Error("Invalid username or password");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userDataWithoutPassword } = user;

    const token = createSession(userDataWithoutPassword);
    return { token };
  }),
  register: t.procedure.input(createSchema).mutation(async ({ input }) => {
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
  }),
});

export type UserRouter = typeof userRouter;
