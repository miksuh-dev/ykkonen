import type { Component } from "solid-js";
import { Card } from "../type";

const Center: Component<{ card: Card }> = (props) => {
  return <div>{props.card.type}</div>;
};

export default Center;
