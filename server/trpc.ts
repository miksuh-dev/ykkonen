import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { Context } from "./context";

const formatError = (error: TRPCError) => {
  if (error.cause instanceof ZodError) {
    return error.cause.issues.reduce<Record<string, string>>(
      (acc, curr) => ({ ...acc, [curr.path.join(".")]: curr.message }),
      {}
    );
  }

  return { general: error.message };
};

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        formattedError: formatError(error),
      },
    };
  },
});
