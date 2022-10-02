import { TRPCError } from "@trpc/server";
import { Player } from "../../type/prisma";
import { Lobby } from "./query";

export interface Message {
  id: string;
  content: string;
  username: string;
  timestamp: number;
  lobbyId: number;
}

// Server state
interface GameStateInternal {
  id: number;
  players: Map<number, Player>;
  messages: Message[];
}

// State that is passed to client
export type GameStateLobby = Omit<GameStateInternal, "players"> & {
  players: Player[];
};

const stateLobby = new Map<number, GameStateInternal>();

const initializeLobby = (lobbyId: number): GameStateInternal => ({
  id: lobbyId,
  players: new Map<number, Player>(),
  messages: [],
});

const convert = (lobby: GameStateInternal): GameStateLobby => {
  return {
    ...lobby,
    players: Array.from(lobby.players.values()),
  };
};

// Internal
const getLobby = (lobbyId: number): GameStateLobby => {
  const lobby = stateLobby.get(lobbyId) ?? initializeLobby(lobbyId);

  return convert(lobby);
};

const getLobbySelectedKeys = <Key extends keyof GameStateLobby>(
  lobby: GameStateLobby,
  keys: Key[]
) => {
  Object.keys(lobby).map((key) => {
    lobby[key as keyof GameStateLobby];
  });

  return keys.reduce((acc, curr) => {
    acc[curr] = lobby[curr];
    return acc;
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
  }, {} as Pick<GameStateLobby, Key>);
};

// Wrapper to make sure taht at least initial state is returned
const getOrCreate = (lobbyId: number) => {
  if (!stateLobby.has(lobbyId)) {
    stateLobby.set(lobbyId, initializeLobby(lobbyId));
  }

  // TODO: Find better way to set GameStateLobby as not undefined
  const lobby = stateLobby.get(lobbyId);
  if (!lobby) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Lobby not found" });
  }

  return lobby;
};

export const addMessage = (lobbyId: number, message: Message): Message => {
  const lobby = getOrCreate(lobbyId);

  lobby.messages.push(message);

  return message;
};

export const exists = (lobbyId: number) => {
  return stateLobby.has(lobbyId);
};

export const get = (
  lobbyId: number,
  keys?: (keyof GameStateLobby)[]
): GameStateLobby | undefined => {
  const lobbyState = stateLobby.get(lobbyId);
  const lobby = lobbyState ? convert(lobbyState) : undefined;

  if (!lobby) {
    return undefined;
  }

  if (keys) {
    return getLobbySelectedKeys(lobby, keys);
  }

  // If keys are not provided, return all
  return lobby;
};

// Extends db lobby to state lobby (creates new one if doesn't exist)
export const extend = (lobby: Lobby, keys?: (keyof GameStateLobby)[]) => {
  const lobbyState = convert(
    stateLobby.get(lobby.id) ?? initializeLobby(lobby.id)
  );

  if (keys) {
    return {
      ...lobby,
      ...getLobbySelectedKeys(lobbyState, keys),
    };
  }

  // If keys are not provided, return all
  return {
    ...lobby,
    ...lobbyState,
  };
};

export const hasPlayer = (lobbyId: number, playerId: number) => {
  const lobby = stateLobby.get(lobbyId);
  if (!lobby) return false;

  return lobby.players.has(playerId);
};

export const addPlayer = (lobbyId: number, player: Player) => {
  // Create lobbystate when first player joins
  const lobby = getOrCreate(lobbyId);

  if (!lobby.players.has(player.id)) {
    lobby.players.set(player.id, player);
  }

  return getLobby(lobbyId).players;
};

export const removePlayer = (lobbyId: number, playerId: number) => {
  const lobby = stateLobby.get(lobbyId);

  if (!lobby) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Lobby not found" });
  }

  if (lobby.players.has(playerId)) {
    lobby.players.delete(playerId);
  }

  return getLobby(lobbyId).players;
};
