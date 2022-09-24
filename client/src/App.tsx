import type { Component } from "solid-js";
import { Show } from "solid-js/web";
import { Routes, Route, Navigate } from "@solidjs/router";

import Loading from "components/Loading";
import Login from "view/Login";
import Register from "view/Register";
import Lobby from "view/Lobby";

import useAuth from "hooks/useAuth";

const App: Component = () => {
  const auth = useAuth();

  const getPath = () => {
    if (auth.authenticated()) {
      return "/lobby";
    }

    return "/login";
  };

  return (
    <Show when={auth.ready()} fallback={<Loading />}>
      <Routes>
        <Route path="/">
          <Navigate href={getPath} />
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/lobby" component={Lobby} />
      </Routes>
    </Show>
  );
};

export default App;
