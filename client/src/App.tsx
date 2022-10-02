import { Component } from "solid-js";
import { lazy, Suspense, ErrorBoundary } from "solid-js";
import { Show } from "solid-js/web";
import { Routes, Route, Navigate } from "@solidjs/router";
import useAuth from "hooks/useAuth";

import lobbyViewData from "view/Lobby/View/data";
import lobbyListData from "view/Lobby/List/data";

const Loading = lazy(() => import("components/Loading"));
const Login = lazy(() => import("view/Login"));

const LobbyCreate = lazy(() => import("view/Lobby/Create"));
const LobbyList = lazy(() => import("view/Lobby/List"));
const LobbyView = lazy(() => import("view/Lobby/View"));

const Register = lazy(() => import("view/Register"));

const App: Component = () => {
  const auth = useAuth();

  const getPath = () => {
    if (auth.authenticated()) {
      return "/lobby/list";
    }

    return "/login";
  };

  return (
    <Suspense fallback={<Loading />}>
      <Show when={auth.ready()} fallback={<Loading />}>
        <Routes>
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
              <Route path="list" component={LobbyList} data={lobbyListData} />
              <Route path="create" component={LobbyCreate} />
              <ErrorBoundary
                fallback={(err) => {
                  console.log("err", err);
                  return <p>asd</p>;
                }}
              >
                <Route path=":id" component={LobbyView} data={lobbyViewData} />
              </ErrorBoundary>
            </Route>
          </Show>
          <Route path="*" element={<Navigate href={getPath} />} />
        </Routes>
      </Show>
    </Suspense>
  );
};

export default App;
