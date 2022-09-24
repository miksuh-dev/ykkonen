import { Card, CardImage } from "../../../server/type";
import { CardType, CardColor, CardAction } from "../../../server/enum";

const Y_OFFSET = 7;
const X_OFFSET = 7;
const ROW_HEIGHT = 55;
const COLUMN_WIDTH = 73;

const getCardImageY = (card: Card): number => {
  if (CardType.WILD === card.type || CardType.SPINNER === card.type) {
    return Y_OFFSET + ROW_HEIGHT * 8;
  }

  switch (card.color) {
    case CardColor.BLUE:
      return Y_OFFSET;
    case CardColor.YELLOW:
      return Y_OFFSET + ROW_HEIGHT * 2;
    case CardColor.GREEN:
      return Y_OFFSET + ROW_HEIGHT * 4;
    case CardColor.RED:
      return Y_OFFSET + ROW_HEIGHT * 6;
    default:
      throw new Error("Invalid card color");
  }
};

const getCardImageX = (card: Card) => {
  if (card.type === CardType.NUMBER) {
    return X_OFFSET + COLUMN_WIDTH * (card.number - 1);
  }

  if (card.type === CardType.WILD) {
    if (card.action === CardAction.CHOOSE_COLOR) {
      return X_OFFSET + COLUMN_WIDTH * 0;
    }

    if (card.action === CardAction.PLUS_FOUR) {
      return X_OFFSET + COLUMN_WIDTH * 1;
    }
  }

  if (card.type === CardType.SPINNER) {
    return X_OFFSET + COLUMN_WIDTH * 2;
  }

  if (card.type === CardType.ACTION) {
    if (card.action === CardAction.SKIP) {
      return X_OFFSET + COLUMN_WIDTH * 9;
    }

    if (card.action === CardAction.PLUS_TWO) {
      return X_OFFSET + COLUMN_WIDTH * 10;
    }

    if (card.action === CardAction.REVERSE) {
      return X_OFFSET + COLUMN_WIDTH * 11;
    }

    if (card.action === CardAction.SWAP) {
      return X_OFFSET + COLUMN_WIDTH * 12;
    }
  }
  throw new Error("Invalid card action");
};

const getCardImage = (card: Card): CardImage => {
  return {
    path: "/images/cards.png",
    x: getCardImageX(card),
    y: getCardImageY(card),
    height: 95,
    width: 59,
  };
};

export const generateCard = (data: Card): Card => {
  const image = getCardImage(data);

  if (data.type === CardType.NUMBER) {
    return {
      color: data.color,
      number: 1,
      type: CardType.NUMBER,
      image,
    };
  }

  if (data.type === CardType.ACTION) {
    return {
      color: data.color,
      action: data.action,
      type: CardType.ACTION,
      image,
    };
  }

  if (data.type === CardType.WILD) {
    return {
      color: CardColor.WILD,
      action: data.action,
      type: CardType.WILD,
      image,
    };
  }

  // Spinner card
  return {
    type: CardType.SPINNER,
    action: CardAction.SPIN,
    image,
  };
};
