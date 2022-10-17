import { JSX } from "solid-js";
import type { Component } from "solid-js";
import Navbar from "../Navbar";

const Content: Component<{ title: string; children: JSX.Element }> = (
  props
) => (
  <div class="h-full">
    <Navbar />
    <div class="flex items-center justify-center ">
      <div class="flex flex-col space-y-8 p-4">
        <h1 class="text-center text-4xl font-bold text-white">{props.title}</h1>
        <div class="w-full">{props.children}</div>
      </div>
    </div>
  </div>
);

export default Content;
