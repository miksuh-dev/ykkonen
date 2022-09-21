import * as trpc from "@trpc/server";
import { z } from "zod";

interface Player {
  id: string;
  name: string;
}

enum GameStatus {
  WAITING,
  STARTED,
  ENDED,
}

interface Lobby {
  id: string;
  name: string;
  players: Player[];
  status: GameStatus;
  ownerId: number;
}

const lobbies: Record<string, Lobby> = {};

export const lobbyRouter = trpc
  .router()
  // .query("getUserById", {
  //   input: z.string(),
  //   resolve({ input }) {
  //     return users[input]; // input type is string
  //   },
  // })
  // .subscription("createLobby", {
  //   input: z.object({
  //     name: z.string().min(1),
  //     ownerId: z.number().min(1),
  //   }),
  //   resolve({ input }) {
  //     return new trpc.Subscription<{ lobby: Lobby }>((emit) => {
  //       const id = Date.now().toString();
  //       const lobby: Lobby = {
  //         id,
  //         name: input.name,
  //         ownerId: input.ownerId,
  //         players: [],
  //         status: GameStatus.WAITING,
  //       };
  //       lobbies[lobby.id] = lobby;
  //
  //       emit.data({ lobby });
  //       // const timer = setInterval(() => {
  //       //   // emits a number every second
  //       // }, 200);
  //
  //       return () => {
  //         // clearInterval(timer);
  //       };
  //     });
  //   },
  .mutation("createLobby", {
    // validate input with Zod
    input: z.object({
      name: z.string().min(1),
      ownerId: z.number().min(1),
    }),
    resolve({ input }) {
      const id = Date.now().toString();
      const lobby: Lobby = {
        id,
        name: input.name,
        ownerId: input.ownerId,
        players: [],
        status: GameStatus.WAITING,
      };
      lobbies[lobby.id] = lobby;

      return lobby;
    },
  });

export type LobbyRouter = typeof lobbyRouter;
