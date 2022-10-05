import type { Component } from "solid-js";
import Login from "components/Form/Login";

const LoginView: Component = () => {
  return (
    <div class="flex h-full items-center justify-center">
      <Login />
    </div>
  );
};

export default LoginView;
