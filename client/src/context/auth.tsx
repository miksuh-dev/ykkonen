import {
  JSX,
  createContext,
  onMount,
  createSignal,
  Accessor,
  batch,
} from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import trpcClient from "trpc";
import { User } from "trpc/types";
import type { Component } from "solid-js";

type AuthStoreProps = {
  user: Accessor<User | null>;
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
  const location = useLocation();

  const [authenticated, setAuthenticated] = createSignal<boolean>(false);
  const [user, setUser] = createSignal<User | null>(null);
  const [ready, setReady] = createSignal<boolean>(false);

  const setAuthenticationCookie = (cookie: string) => {
    document.cookie = "X-Authorization=" + cookie + "; path=/";
    localStorage.setItem("token", cookie);
  };

  const clearAuthCookie = () => {
    document.cookie = "";
    localStorage.removeItem("token");
  };

  const fetchAndSetMe = () => {
    trpcClient.user.me
      .query()
      .then((res) => {
        batch(() => {
          setUser(res);
          setAuthenticated(true);
          setReady(true);

          if (
            location.pathname === "/login" ||
            location.pathname === "/register"
          ) {
            navigate("/lobby/list");
          }
        });
      })
      .catch((e) => {
        console.log("e", e);
        logout();
      });
  };

  const login = async (username: string, password: string) => {
    try {
      const res = await trpcClient.user.login.mutate({
        username,
        password,
      });

      if (res.token) {
        setAuthenticationCookie(res.token);

        fetchAndSetMe();
      }
    } catch (err) {
      throw err;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const res = await trpcClient.user.register.mutate({
        username: username,
        password: password,
      });

      if (res.token) {
        setAuthenticationCookie(res.token);

        fetchAndSetMe();
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    clearAuthCookie();

    setAuthenticated(false);

    navigate("/login");
  };

  onMount(() => {
    const token = localStorage.getItem("token");

    if (token && !user()) {
      fetchAndSetMe();
    } else {
      if (location.pathname !== "/login") {
        navigate("/login");
      }
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
