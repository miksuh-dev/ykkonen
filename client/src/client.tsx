// import { httpLink } from "@trpc/client/links/httpLink";
// import { splitLink } from "@trpc/client/links/splitLink";
// import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
// import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import type { AppRouter } from "../../server/router";
import env from "./config";

import { createTRPCClient } from "@trpc/client";

// const wsClient = createWSClient({
//   url: env.WEBSOCKET_URL,
// });
//
export const trpcClient = createTRPCClient<AppRouter>({
  url: env.API_URL,
});

// export const trpcClient = createTRPCClient<AppRouter>({
//   fetch(url, options) {
//     return fetch(url, {
//       ...options,
//       credentials: "include",
//     });
//   },
//   url: env.API_URL,
//   links: [
//     () =>
//       ({ op, prev, next }) => {
//         console.log("->", op.type, op.path, op.input);
//
//         return next(op, (result) => {
//           console.log("<-", op.type, op.path, op.input, ":", result);
//           prev(result);
//         });
//       },
//     httpBatchLink({ url: env.API_URL }),
//     // splitLink({
//     //   condition(op) {
//     //     return op.type === "subscription";
//     //   },
//     //   true: wsLink({
//     //     client: wsClient,
//     //   }),
//     //   false: httpLink({
//     //     url: env.API_URL,
//     //   }),
//     // }),
//   ],
// });
