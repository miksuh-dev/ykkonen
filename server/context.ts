// import http from "http";
import { IncomingMessage } from "http";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import ws from "ws";
import { getUserFromHeader } from "./utils/auth";

export const createContext = async ({
  res,
  req,
}:
  | CreateExpressContextOptions
  | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => {
  const user = await getUserFromHeader(req.headers);

  return {
    headers: req.headers,
    user,
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;