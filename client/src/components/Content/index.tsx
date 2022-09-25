import { JSX } from "solid-js";
import type { Component } from "solid-js";
import Navbar from "../Navbar";

const Content: Component<{ title: string; children: JSX.Element }> = (
  props
) => (
  <div class="h-full">
    <Navbar />
    <div class="h-full flex justify-center items-center p-4">
      <div class="flex flex-col space-y-8">
        <h1 class="text-4xl font-bold text-center text-white">{props.title}</h1>
        <div class="min-w-[350px]">{props.children}</div>
      </div>
    </div>
  </div>
);

export default Content;
