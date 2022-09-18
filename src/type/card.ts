import { CardColor, CardType, CardAction } from "../enum/card";

interface BaseCard {
  type: CardType;
  image?: CardImage;
}

interface NumberCard extends BaseCard {
  type: CardType.NUMBER;
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  color: CardColor.RED | CardColor.BLUE | CardColor.GREEN | CardColor.YELLOW;
}

interface ActionCard extends BaseCard {
  type: CardType.ACTION;
  action:
    | CardAction.SKIP
    | CardAction.PLUS_TWO
    | CardAction.REVERSE
    | CardAction.SWAP;
  color: CardColor.RED | CardColor.BLUE | CardColor.GREEN | CardColor.YELLOW;
}

interface WildCard extends BaseCard {
  type: CardType.WILD;
  action: CardAction.PLUS_FOUR | CardAction.CHOOSE_COLOR;
  color: CardColor.ANY;
}

interface SpinnerCard extends BaseCard {
  type: CardType.SPINNER;
  action: CardAction.SPIN;
}

export interface CardImage {
  path: string;
  x: number;
  y: number;
  height: number;
  width: number;
}

export type Card = NumberCard | ActionCard | WildCard | SpinnerCard;
