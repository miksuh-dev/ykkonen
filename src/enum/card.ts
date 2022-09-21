export enum CardColor {
  BLUE = 1,
  YELLOW = 2,
  GREEN = 3,
  RED = 4,
  ANY = 5,
}

export enum CardType {
  NUMBER = 1,
  ACTION = 2,
  WILD = 3,
  SPINNER = 4,
}

export enum CardAction {
  SKIP = 1,
  PLUS_TWO = 2,
  PLUS_FOUR = 4,
  CHOOSE_COLOR = 5,
  SWAP = 7,
  REVERSE = 8,
  SPIN = 9,
}
