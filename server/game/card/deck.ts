import { CardType, CardAction, CardColor, CardNumber } from "../../enum/card";
import {
  Card,
  NumberCard,
  ActionCard,
  WildCard,
  SpinnerCard,
} from "../../type/card";

const normalColors = [
  CardColor.RED,
  CardColor.BLUE,
  CardColor.GREEN,
  CardColor.YELLOW,
];

const createNumberCards = (): NumberCard[] => {
  return [
    CardNumber.ZERO,
    CardNumber.ONE,
    CardNumber.ONE,
    CardNumber.TWO,
    CardNumber.TWO,
    CardNumber.THREE,
    CardNumber.THREE,
    CardNumber.FOUR,
    CardNumber.FOUR,
    CardNumber.FIVE,
    CardNumber.FIVE,
    CardNumber.SIX,
    CardNumber.SIX,
    CardNumber.SEVEN,
    CardNumber.SEVEN,
    CardNumber.EIGHT,
    CardNumber.EIGHT,
    CardNumber.NINE,
    CardNumber.NINE,
  ]
    .map((number) =>
      normalColors.map(
        (color): NumberCard => ({
          type: CardType.NUMBER,
          color,
          number,
        })
      )
    )
    .flat(1);
};

const createActionCards = (): ActionCard[] => {
  return [
    CardAction.SKIP,
    CardAction.PLUS_TWO,
    CardAction.REVERSE,
    CardAction.SWAP,
    CardAction.SKIP,
    CardAction.PLUS_TWO,
    CardAction.REVERSE,
    CardAction.SWAP,
  ]
    .map((action) =>
      normalColors.map(
        (color): ActionCard => ({
          type: CardType.ACTION,
          color,
          action,
        })
      )
    )
    .flat(1);
};

const createWildCards = (): WildCard[] => {
  return [
    CardAction.PLUS_FOUR,
    CardAction.PLUS_FOUR,
    CardAction.PLUS_FOUR,
    CardAction.PLUS_FOUR,
    CardAction.CHOOSE_COLOR,
    CardAction.CHOOSE_COLOR,
    CardAction.CHOOSE_COLOR,
    CardAction.CHOOSE_COLOR,
  ].map(
    (action): WildCard => ({
      type: CardType.WILD,
      color: CardColor.WILD,
      action,
    })
  );
};

const createSpinnerCards = (): SpinnerCard[] => {
  return [CardAction.SPIN, CardAction.SPIN, CardAction.SPIN, CardAction.SPIN]
    .map(
      (action): SpinnerCard => ({
        type: CardType.SPINNER,
        action,
      })
    )
    .flat(1);
};

export const createDeck = (deckCount = 1): Card[] => {
  const numberCards = createNumberCards();
  const actionCards = createActionCards();
  const wildCards = createWildCards();
  const spinnerCards = createSpinnerCards();

  return [...Array<number>(deckCount)]
    .map((): Card[] => {
      return [...numberCards, ...actionCards, ...wildCards, ...spinnerCards];
    })
    .flat(1);
};
