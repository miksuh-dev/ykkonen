import {
  JSX,
  createContext,
  onMount,
  createSignal,
  Accessor,
  batch,
} from "solid-js";
import trpcClient from "trpc";
import { User } from "trpc/types";
import type { Component } from "solid-js";
import { UserRegisterInput, UserLoginInput } from "trpc/types";

type AuthStoreProps = {
  user: Accessor<User | null>;
  authenticated: Accessor<boolean>;
  ready: Accessor<boolean>;
};

interface AuthContextProps extends AuthStoreProps {
  action: {
    login: (data: UserLoginInput) => Promise<void>;
    logout: () => void;
    register: (data: UserRegisterInput) => Promise<void>;
  };
}

const INITIAL_VALUE = {
  authenticated: () => false,
  user: () => null,
  ready: () => false,
  action: {
    login: async () => {},
    logout: () => {},
    register: async () => {},
  },
};

export const AuthContext = createContext<AuthContextProps>(INITIAL_VALUE);

export const AuthProvider: Component<{
  children: JSX.Element;
}> = (props) => {
  const [authenticated, setAuthenticated] = createSignal<boolean>(false);
  const [user, setUser] = createSignal<User | null>(null);
  const [ready, setReady] = createSignal<boolean>(false);

  const fetchAndSetMe = () => {
    trpcClient.user.me
      .query()
      .then((res) => {
        batch(() => {
          setUser(res);
          setAuthenticated(true);
          setReady(true);
        });
      })
      .catch((e) => {
        console.log("e", e);
        logout();
      });
  };

  const login = async (data: UserLoginInput) => {
    try {
      const res = await trpcClient.user.login.mutate(data);

      if (res.token) {
        localStorage.setItem("token", res.token);

        const win: Window = window;
        win.location.reload();
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (data: UserRegisterInput) => {
    try {
      const res = await trpcClient.user.register.mutate(data);

      if (res.token) {
        localStorage.setItem("token", res.token);

        const win: Window = window;
        win.location.reload();
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    const win: Window = window;
    win.location.reload();
  };

  onMount(() => {
    const token = localStorage.getItem("token");

    if (token && !user()) {
      fetchAndSetMe();
    } else {
      setReady(true);
    }
  });

  const value = {
    user,
    authenticated,
    ready,
    action: {
      login,
      register,
      logout,
    },
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
