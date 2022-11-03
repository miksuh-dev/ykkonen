import { Component, lazy, Match, Switch } from "solid-js";
import LobbyView from "components/Lobby/View";
import Content from "components/Content";
import data from "view/Lobby/View/data";
import { useRouteData } from "@solidjs/router";

const Solo = lazy(() => import("game/Solo"));

export type RouteData = ReturnType<typeof data>;

const LobbyViewView: Component = () => {
  const routeData = useRouteData<RouteData>();

  return (
    <Switch>
      <Match
        when={
          // TODO Find way to type these also
          routeData?.lobby()?.status === "waiting"
        }
      >
        <Content title={"Huone:"}>
          <LobbyView />
        </Content>
      </Match>
      <Match when={routeData?.lobby()?.status === "started"}>
        <Switch>
          {/* // TODO Find way to type these also */}
          <Match when={routeData?.lobby()?.gameType.name === "Solo"}>
            <Solo />
          </Match>
        </Switch>
      </Match>
    </Switch>
  );
};

export default LobbyViewView;
