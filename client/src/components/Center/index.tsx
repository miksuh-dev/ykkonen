import { JSX } from "solid-js";
import type { Component } from "solid-js";

const Center: Component<{ children: JSX.Element }> = (props) => (
  <div class="h-full flex justify-center items-center">{props.children}</div>
);

export default Center;
