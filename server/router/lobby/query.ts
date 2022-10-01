import { Prisma } from "@prisma/client";
import prisma from "../../prisma";

export const getLobby = (lobbyId: number) => {
  return prisma.lobby.findFirstOrThrow({
    select: {
      id: true,
      name: true,
      gameType: true,
      status: true,
      owner: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    where: {
      id: lobbyId,
    },
  });
};

export const getLobbies = () => {
  return prisma.lobby.findMany({
    select: {
      id: true,
      name: true,
      gameType: true,
      status: true,
      owner: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

export type Lobby =
  | Prisma.PromiseReturnType<typeof getLobby>
  | Prisma.PromiseReturnType<typeof getLobbies>[number];
