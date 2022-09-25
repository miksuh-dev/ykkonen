import type { Component } from "solid-js";
import Login from "components/Form/Login";

const LoginView: Component = () => {
  return (
    <div class="h-full flex justify-center items-center">
      <Login />
    </div>
  );
};

export default LoginView;
