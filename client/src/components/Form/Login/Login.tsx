import { Link } from "@solidjs/router";
import { Accessor, Setter } from "solid-js";
import type { Component } from "solid-js";
import { UserLoginInput } from "trpc/types";
import { FormError } from "./index";

type Props = {
  form: Accessor<UserLoginInput>;
  onChange: Setter<UserLoginInput>;
  error: Accessor<FormError>;
  onSubmit: (data: UserLoginInput) => void;
};

const Login: Component<Props> = (props) => (
  <form
    class="block space-y-6"
    onSubmit={(e) => {
      e.preventDefault();
    }}
  >
    <div class="space-y-4">
      <div
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit(props.form());
        }}
      >
        <label for="first_name" class="text-primary mb-2 block">
          Käyttäjänimi:
        </label>
        <input
          type="text"
          id="username"
          class="input-primary"
          required
          value={props.form().username}
          onChange={(e) =>
            props.onChange({
              ...props.form(),
              username: e.currentTarget.value,
            })
          }
        />
        {props.error().username && (
          <div class="text-sm text-red-500">{props.error().username}</div>
        )}
      </div>
      <div>
        <label for="first_name" class="text-primary mb-2 block">
          Salasana
        </label>
        <input
          type="password"
          id="username"
          class="input-primary"
          required
          value={props.form().password}
          onChange={(e) =>
            props.onChange({
              ...props.form(),
              password: e.currentTarget.value,
            })
          }
        />
        {props.error().password && (
          <div class="text-sm text-red-500">{props.error().password}</div>
        )}
      </div>
      {props.error().general && (
        <div class="text-sm text-red-500">{props.error().general}</div>
      )}
    </div>
    <div class="w-full space-y-4">
      <button
        class="btn-primary-full"
        onClick={() => props.onSubmit(props.form())}
        type="submit"
      >
        Kirjaudu sisään
      </button>
      <Link class="btn-secondary-full" href="/register">
        Luo tunnus
      </Link>
    </div>
  </form>
);

export default Login;
