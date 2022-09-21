import * as trpcExpress from "@trpc/server/adapters/express";
// import { createHTTPServer } from "@trpc/server/adapters/standalone";
// import { applyWSSHandler } from "@trpc/server/adapters/ws";
import express from "express";
// import ws from "ws";
import { appRouter /* , AppRouter */ } from "./router";

// http server
// const { server, listen } = createHTTPServer({
//   router: appRouter,
//   createContext() {
//     return {
//       asdasd: "asd",
//     };
//   },
// });

// ws server
// const wss = new ws.Server({ server });
// applyWSSHandler<AppRouter>({
//   wss,
//   router: appRouter,
//   createContext() {
//     return {};
//   },
// });

// express implementation
const app = express();

app.use((req, _res, next) => {
  // request logger
  console.log("⬅️ ", req.method, req.path, req.body ?? req.query);

  next();
});

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }: trpcExpress.CreateExpressContextOptions) => {
      const getUser = () => {
        if (req.headers.authorization !== "secret") {
          return null;
        }
        return {
          name: "test",
        };
      };

      return {
        req,
        res,
        user: getUser(),
      };
    },
  })
);

app.use((req, _res, next) => {
  // request logger
  console.log("⬅️ ", req.method, req.path, req.body ?? req.query);
  next();
});

app.get("/", (_req, res) => res.send("hello"));
app.listen(2021, () => {
  console.log("listening on port 2021");
});
