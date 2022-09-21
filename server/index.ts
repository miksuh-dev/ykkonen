import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";
import { appRouter, AppRouter } from "./router";

// http server
// eslint-disable-next-line @typescript-eslint/unbound-method
const { server, listen } = createHTTPServer({
  router: appRouter,
  createContext() {
    return {};
  },
});

// ws server
const wss = new ws.Server({ server });
applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext() {
    return {};
  },
});

console.log("Listening...");

listen(2022);
