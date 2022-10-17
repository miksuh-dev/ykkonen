import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { t } from "../../trpc";
import { comparePassword, createSession } from "../../utils/auth";
import { authedProcedure } from "../utils";

export const userRouter = t.router({
  me: authedProcedure.query(({ ctx }) => {
    const { user } = ctx;

    return user;
  }),
  login: t.procedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          username: input.username,
        },
      });

      if (!user) {
        throw new TRPCError({
          message: "Invalid username or password",
          code: "BAD_REQUEST",
        });
      }

      const passwordsMatch = await comparePassword(
        input.password,
        user.password
      );
      if (!passwordsMatch) {
        throw new TRPCError({
          message: "Invalid username or password",
          code: "BAD_REQUEST",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userDataWithoutPassword } = user;

      const token = createSession(userDataWithoutPassword);
      return { token };
    }),
  register: t.procedure
    .input(
      z.object({
        username: z.string().min(1),
        password: z.string().min(1),
        passwordAgain: z.string().min(1),
        // .min(8, "Password must be at least 8 characters")
        // .max(32, "Password must be at most 20 characters")
        // .refine(
        //   (value) => /[0-9]/.test(value),
        //   "Password must contain at least one number"
        // ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { username, password } = input;

      const existingUser = await ctx.prisma.user.findUnique({
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

      const user = await ctx.prisma.user.create({
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
