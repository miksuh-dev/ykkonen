import type { Component } from "solid-js";
import { Card, CardImage } from "../../../../server/src/type";

const getClipPathString = (image: CardImage) => {
  const { height, width, x, y } = image;

  return `polygon(
      ${x}px ${y}px,
      ${x + width}px ${y}px,
      ${x + width}px ${y + height}px,
      ${x}px ${y + height}px
  `;
};

const CardComponent: Component<{
  data: Card;
}> = (props) => {
  return (
    <div
      class="relative overflow-hidden"
      style={{
        height: `${props.data.image.height}px`,
        width: `${props.data.image.width}px`,
      }}
    >
      <img
        class="fixed"
        style={{
          "clip-path": getClipPathString(props.data.image),
          "-webkit-clip-path": getClipPathString(props.data.image),
          top: `-${props.data.image.y}px`,
          left: `-${props.data.image.x}px`,
        }}
        src={props.data.image.path}
      />
      {props.data.type}
    </div>
  );
};

export default CardComponent;
