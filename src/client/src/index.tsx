/* @refresh reload */
import "./index.css";
// eslint-disable-next-line import/no-unresolved
import { render } from "solid-js/web";

import { init } from "./client";
init();

import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

render(() => <App />, root);
