import { httpLink } from "@trpc/client/links/httpLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import type { AppRouter } from "../../../server/router";
import env from "../config";

import { createTRPCClient } from "@trpc/client";

const wsClient = createWSClient({
  url: env.WEBSOCKET_URL,
});

const trpcClient = createTRPCClient<AppRouter>({
  headers() {
    return {
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
  },
  links: [
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpLink({
        url: env.API_URL,
      }),
    }),
  ],
});

export default trpcClient;
