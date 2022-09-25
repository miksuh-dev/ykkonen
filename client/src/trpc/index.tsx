import { httpBatchLink } from "@trpc/client";
import { splitLink } from "@trpc/client/links/splitLink";
import { createTRPCProxyClient } from "@trpc/client";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import type { AppRouter } from "../../../server/router";
import env from "../config";

// import { createTRPCProxyClient } from "@trpc/client";

export const wsClient = createWSClient({
  url: env.WEBSOCKET_URL,
});

const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition(op) {
        return op.type === "subscription";
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: env.API_URL,
        headers() {
          return {
            Authorization: "Bearer " + localStorage.getItem("token"),
          };
        },
      }),
    }),
  ],
});

export default trpcClient;
