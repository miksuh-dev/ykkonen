/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";

import { init } from "./client";
init()

import App from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
