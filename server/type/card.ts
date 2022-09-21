import { CardColor, CardType, CardAction, CardNumber } from "../enum/card";

interface BaseCard {
  type: CardType;
  image?: CardImage;
}

export interface NumberCard extends BaseCard {
  type: CardType.NUMBER;
  number: CardNumber;
  color: CardColor;
}

export interface ActionCard extends BaseCard {
  type: CardType.ACTION;
  action: CardAction;
  color: CardColor;
}

export interface WildCard extends BaseCard {
  type: CardType.WILD;
  action: CardAction;
  color: CardColor.WILD;
}

export interface SpinnerCard extends BaseCard {
  type: CardType.SPINNER;
  action: CardAction;
}

export interface CardImage {
  path: string;
  x: number;
  y: number;
  height: number;
  width: number;
}

export type Card = NumberCard | ActionCard | WildCard | SpinnerCard;
