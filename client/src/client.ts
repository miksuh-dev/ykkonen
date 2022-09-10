import { createTRPCClient } from "@trpc/client";
import { httpLink } from "@trpc/client/links/httpLink";
import { splitLink } from "@trpc/client/links/splitLink";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import type { AppRouter } from "../../server/src/router";

export async function init() {
  // http calls
  const wsClient = createWSClient({
    url: `ws://localhost:2022`,
  });
  const client = createTRPCClient<AppRouter>({
    links: [
      // call subscriptions through websockets and the rest over http
      splitLink({
        condition(op) {
          return op.type === "subscription";
        },
        true: wsLink({
          client: wsClient,
        }),
        false: httpLink({
          url: `http://localhost:2022`,
        }),
      }),
    ],
  });
  //
  // const helloResponse = await client.query("hello", {
  //   name: "world",
  // });
  //
  // console.log("helloResponse", helloResponse);
  //
  // const createPostRes = await client.mutation("createPost", {
  //   title: "hello world",
  //   text: "check out tRPC.io",
  // });
  // console.log("createPostResponse", createPostRes);

  client.subscription("randomNumber", null, {
    onNext(data) {
      console.log("received", data);
    },
    onError(err) {
      console.error("error", err);
    },
    onDone() {
      console.log("done called - closing websocket");
      wsClient.close();
    },
  });
}
