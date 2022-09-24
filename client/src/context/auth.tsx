import {
  JSX,
  createContext,
  onMount,
  createSignal,
  Accessor,
  batch,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import client from "trpc";
import { InferQueryOutput } from "trpc/types";
import type { Component } from "solid-js";

type User = InferQueryOutput<"user.me"> | null;

type AuthStoreProps = {
  user: Accessor<User>;
  authenticated: Accessor<boolean>;
  ready: Accessor<boolean>;
};

interface AuthContextProps extends AuthStoreProps {
  action: {
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, password: string) => Promise<void>;
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
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = createSignal<boolean>(false);
  const [user, setUser] = createSignal<User>(null);
  const [ready, setReady] = createSignal<boolean>(false);

  const fetchAndSetMe = () => {
    client
      .query("user.me")
      .then((res) => {
        batch(() => {
          setUser(res);
          setAuthenticated(true);
          navigate("/lobby/list");
          setReady(true);
        });
      })
      .catch((e) => {
        console.log("e", e);
        logout();
      });
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await client.mutation("user.login", {
        username,
        password,
      });

      if (res.token) {
        localStorage.setItem("token", res.token);

        fetchAndSetMe();
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const res = await client.mutation("user.create", {
        username: username,
        password: password,
      });

      if (res.token) {
        localStorage.setItem("token", res.token);

        fetchAndSetMe();
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);

    navigate("/login");
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
