import { TRPCError } from "@trpc/server";
import { GameType } from "../../type/app";
import { Player } from "../../type/prisma";
import { createGame } from "../game/utils";
import { GameStatus } from "./types";

export interface Message {
  id: string;
  content: string;
  username: string;
  timestamp: number;
  lobbyId: number;
}

interface LobbyStateInternalBase {
  id: number;
  name: string;
  players: Map<number, Player>;
  ownerId: number;
  status: GameStatus;
  gameType: GameType;
  game: ReturnType<typeof createGame> | undefined;
  messages: Message[];
  password?: string;
}

// Server state
export type LobbyStateInternal = LobbyStateInternalBase & {
  hasPlayer: (playerId: number) => boolean;
  convert: () => LobbyState;
  addPlayer: (player: Player) => LobbyStateInternal;
  removePlayer: (playerId: number) => LobbyStateInternal;
  addMessage: (message: Message) => Message;
  startGame: () => LobbyStateInternal;
  endGame: () => LobbyStateInternal;
};

export interface PlayerStateInternal {
  playerId: number;
  lobbyId: number;
}

// State that is passed to client
export type LobbyState = Omit<LobbyStateInternalBase, "players" | "game"> & {
  players: Player[];
};

const lobbyState = new Map<number, LobbyStateInternal>();
const playerState = new Map<number, PlayerStateInternal>();

export const getLobbyFromPlayer = (
  playerId: number
): LobbyStateInternal | undefined => {
  const player = playerState.get(playerId);

  if (!player) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Player not found",
    });
  }

  return getLobby(player.lobbyId);
};

export const createLobby = ({
  name,
  gameType,
  ownerId,
}: {
  name: string;
  gameType: GameType;
  ownerId: number;
}): LobbyStateInternal => {
  const newLobby = {
    id: lobbyState.size + 1,
    name,
    players: new Map<number, Player>(),
    messages: new Array<Message>(),
    ownerId: ownerId,
    status: GameStatus.WAITING,
    game: undefined,
    gameType,
    hasPlayer: function (playerId: number) {
      return this.players.has(playerId);
    },
    convert: function (): LobbyState {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { game, ...rest } = this;

      return {
        ...rest,
        players: Array.from(this.players.values()),
      };
    },
    addPlayer: function (player: Player) {
      this.players.set(player.id, player);

      playerState.set(player.id, {
        playerId: player.id,
        lobbyId: this.id,
      });

      return this;
    },
    removePlayer: function (playerId: number) {
      this.players.delete(playerId);

      playerState.delete(playerId);

      return this;
    },
    addMessage: function (message: Message) {
      this.messages.push(message);

      return message;
    },
    startGame: function () {
      this.status = GameStatus.STARTED;
      this.game = createGame(this);

      return this;
    },
    endGame: function () {
      this.status = GameStatus.ENDED;

      return this;
    },
  } as LobbyStateInternal;

  lobbyState.set(newLobby.id, newLobby);

  return newLobby;
};

// client
const getLobby = (lobbyId: number): LobbyStateInternal => {
  const lobby = lobbyState.get(lobbyId);

  if (!lobby) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Lobby not found",
    });
  }

  return lobby;
};

const getLobbySelectedKeys = <Key extends keyof LobbyStateInternal>(
  lobby: LobbyStateInternal,
  keys: Key[]
) => {
  Object.keys(lobby).map((key) => {
    lobby[key as keyof LobbyState];
  });

  return keys.reduce((acc, curr) => {
    acc[curr] = lobby[curr];
    return acc;
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
  }, {} as Pick<LobbyStateInternal, Key>);
};

export const exists = (lobbyId: number) => {
  return lobbyState.has(lobbyId);
};

export const get = (
  lobbyId: number,
  keys?: (keyof LobbyStateInternal)[]
): LobbyStateInternal => {
  const lobby = getLobby(lobbyId);

  if (keys) {
    return getLobbySelectedKeys(lobby, keys);
  }

  // If keys are not provided, return all
  return lobby;
};

export const getLobbies = () => {
  return Array.from(lobbyState.values());
};
