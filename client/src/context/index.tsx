import { JSX } from "solid-js";
import type { Component } from "solid-js";
import { AuthProvider } from "./auth";

const BaseProviders: Component<{
  children: JSX.Element;
}> = (props) => {
  return <AuthProvider>{props.children}</AuthProvider>;
};

export default BaseProviders;
