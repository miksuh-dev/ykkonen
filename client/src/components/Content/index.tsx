import { JSX } from "solid-js";
import type { Component } from "solid-js";
import Navbar from "../Navbar";

const Content: Component<{ children: JSX.Element }> = (props) => (
  <div class="container flex mx-auto justify-center flex-col pt-16 pb-2 md:pb-4 px-2 md:px-0">
    <div class="flex justify-center flex-col items-center space-y-16">
      <Navbar />
      {props.children}
    </div>
  </div>
);

export default Content;
