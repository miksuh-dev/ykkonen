import trpcClient from "trpc";
import { GameState } from "./type";
import { createResource, Signal } from "solid-js";
import { createStore, reconcile, unwrap } from "solid-js/store";

function createDeepSignal<T>(value: T): Signal<T> {
  const [store, setStore] = createStore({
    value,
  });

  return [
    () => store.value,
    (v: T) => {
      const unwrapped = unwrap(store.value);
      typeof v === "function" && (v = v(unwrapped));
      setStore("value", reconcile(v));
      return store.value;
    },
  ] as Signal<T>;
}

function useGameData() {
  const [gameState] = createResource<GameState>(
    async () => trpcClient.game.solo.state.query(),
    {
      storage: createDeepSignal,
    }
  );

  return {
    gameState,
  };
}

export default useGameData;
