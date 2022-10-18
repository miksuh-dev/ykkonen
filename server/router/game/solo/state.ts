/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LobbyStateInternal } from "router/lobby/state";
import { Player } from "type/prisma";
import { createDeck } from "./deck";
import { Card } from "./type";

enum Direction {
  CLOCKWISE = "CW",
  COUNTER_CLOCKWISE = "CCW",
}

type SoloPlayerInternal = Player & {
  hand: Card[];
};

type SoloPlayer = Omit<SoloPlayerInternal, "hand"> & {
  cardsCount: number;
};

export interface SoloGameStateInternalBase {
  lobbyId: number;
  centerCard: Card;
  deck: Card[];
  discard: Card[];
  players: SoloPlayerInternal[];
  currentPlayer: number;
  direction: Direction;
}

export type SoloGameStateInternal = SoloGameStateInternalBase & {
  convert: () => SoloGameState;
};

// State that is passed to client
export type SoloGameState = Omit<
  SoloGameStateInternalBase,
  "players" | "deck" | "discard"
> & {
  players: SoloPlayer[];
  deckCount: number;
  discardCount: number;
};

export const createGame = (
  lobbyState: LobbyStateInternal
): SoloGameStateInternal => {
  const deck = createDeck();
  const discard: Card[] = [];
  const centerCard = deck.pop()!;
  const currentPlayer = 0;
  const direction = Direction.CLOCKWISE;

  const players = lobbyState.convert().players.map((player) => ({
    ...player,
    hand: deck.splice(0, 7),
  }));

  const game = {
    lobbyId: lobbyState.id,
    centerCard,
    deck,
    players,
    discard,
    currentPlayer,
    direction,
    convert: function () {
      // eslint-disable-next-line @typescript-eslint/no-shadow, @typescript-eslint/no-unused-vars
      const { deck, ...restGame } = this;

      return {
        ...restGame,
        players: this.players.map((player) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { hand, ...restPlayer } = player;

          return {
            ...restPlayer,
            cardsCount: player.hand.length,
          };
        }),
        deckCount: game.deck.length,
        discardCount: game.discard.length,
      };
    },
  };

  return game;
};
