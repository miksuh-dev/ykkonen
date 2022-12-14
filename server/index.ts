import http from "http";
import * as trpcExpress from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import express from "express";
import ws from "ws";
import { createContext } from "./context";
import { appRouter, AppRouter } from "./router";

const app = express();
const server = http.createServer(app);

// ws server
const wss = new ws.Server({ server });
const wsHandler = applyWSSHandler<AppRouter>({
  wss,
  router: appRouter,
  createContext,
});

app.use((req, res, next) => {
  // TODO: Fix these at some point
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  console.log("⬅️ ", req.method, req.path, req.body ?? req.query);

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  next();
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use(express.static("client/build"));
app.use("/images", express.static("client/build/images"));
app.use("/assets", express.static("client/build/assets"));
app.get("*", (_, res) => {
  res.sendFile("index.html", {
    root: "client/build",
  });
});

const port = 2021;
server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on("error", console.error);

wss.on("connection", () => {
  console.log(`Connection (${wss.clients.size})`);
});

process.on("SIGTERM", () => {
  wsHandler.broadcastReconnectNotification();
  wss.close();
  server.close();
});
