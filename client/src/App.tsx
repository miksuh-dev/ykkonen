import type { Component } from "solid-js";
import { lazy } from "solid-js";
import { Show } from "solid-js/web";
import { Routes, Route, Navigate } from "@solidjs/router";

const Loading = lazy(() => import("components/Loading"));
const Login = lazy(() => import("view/Login"));

const Register = lazy(() => import("view/Register"));
const LobbyCreate = lazy(() => import("view/LobbyCreate"));
const LobbyList = lazy(() => import("view/LobbyList"));

import useAuth from "hooks/useAuth";

const App: Component = () => {
  const auth = useAuth();

  const getPath = () => {
    if (auth.authenticated()) {
      return "/lobby/list";
    }

    return "/login";
  };

  return (
    <Show when={auth.ready()} fallback={<Loading />}>
      <Routes>
        <Route path="/">
          <Navigate href={getPath} />
        </Route>
        <Show
          when={auth.authenticated()}
          fallback={
            <>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
            </>
          }
        >
          <Route path="/lobby">
            <Route path="list" component={LobbyList} />
            <Route path="create" component={LobbyCreate} />
          </Route>
        </Show>
      </Routes>
    </Show>
  );
};

export default App;
