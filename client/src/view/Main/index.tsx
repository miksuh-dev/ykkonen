import type { Component } from "solid-js";
import Login from "components/LoginForm";

const Main: Component = () => {
  return (
    <div class="container flex mx-auto justify-center flex-col">
      <div class="flex justify-center flex-col items-center">
        <Login />
      </div>
    </div>
  );
};

export default Main;
