import { Link } from "@solidjs/router";
import { Accessor, Setter } from "solid-js";
import type { Component } from "solid-js";

type FormProps = {
  username: string;
  password: string;
};

type Props = {
  form: Accessor<FormProps>;
  onChange: Setter<FormProps>;
  error: Accessor<Partial<FormProps>>;
  onSubmit: (data: Accessor<FormProps>) => void;
};

const Login: Component<Props> = (props) => (
  <div class="block space-y-6">
    <div class="space-y-4">
      <div>
        <label for="first_name" class="block mb-2 text-primary">
          Käyttäjänimi:
        </label>
        <input
          type="text"
          id="username"
          class="input-primary"
          required
          value={props.form().username}
          onChange={(e) =>
            props.onChange({ ...props.form(), username: e.currentTarget.value })
          }
        />
        {props.error().username && (
          <div class="text-red-500 text-sm">{props.error().username}</div>
        )}
      </div>
      <div>
        <label for="first_name" class="block mb-2 text-primary">
          Salasana
        </label>
        <input
          type="password"
          id="username"
          class="input-primary"
          required
          value={props.form().password}
          onChange={(e) =>
            props.onChange({ ...props.form(), password: e.currentTarget.value })
          }
        />
        {props.error().password && (
          <div class="text-red-500 text-sm">{props.error().password}</div>
        )}
      </div>
    </div>
    <div class="w-full space-y-4">
      <button
        class="btn-primary-full"
        onClick={() => props.onSubmit(props.form)}
      >
        Kirjaudu sisään
      </button>
      <Link class="btn-secondary-full" href="/register">
        Luo tunnus
      </Link>
    </div>
  </div>
);

export default Login;
