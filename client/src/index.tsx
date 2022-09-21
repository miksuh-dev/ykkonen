/* @refresh reload */
import "./index.css";
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";

import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  root
);
