import { Accessor, Setter } from "solid-js";
import { Link } from "@solidjs/router";
import type { Component } from "solid-js";

type FormProps = {
  username: string;
  password: string;
  passwordAgain: string;
};

type Props = {
  form: Accessor<FormProps>;
  onChange: Setter<FormProps>;
  error: Accessor<Partial<FormProps>>;
  onSubmit: (data: Accessor<FormProps>) => void;
};

const Register: Component<Props> = (props) => (
  <form class="block space-y-6" onSubmit={(e) => e.preventDefault()}>
    <div class="flex flex-col space-y-4">
      <div>
        <label for="username" class="block mb-2 text-primary">
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
      </div>
      {props.error().username && (
        <div class="text-red-500">{props.error().username}</div>
      )}
      <div>
        <label for="password" class="block mb-2 text-primary">
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
          <div class="text-red-500">{props.error().password}</div>
        )}
      </div>
      <div>
        <label for="passwordAgain" class="block mb-2 text-primary">
          Salasana uudelleen
        </label>
        <input
          type="password"
          id="username"
          class="input-primary"
          required
          value={props.form().passwordAgain}
          onChange={(e) =>
            props.onChange({
              ...props.form(),
              passwordAgain: e.currentTarget.value,
            })
          }
        />
        {props.error().passwordAgain && (
          <div class="text-red-500">{props.error().passwordAgain}</div>
        )}
      </div>
    </div>
    <div class="w-full space-y-4">
      <button
        class="btn-primary-full"
        onClick={() => props.onSubmit(props.form)}
      >
        Rekisteröidy
      </button>
      <Link class="btn-secondary-full" href="/login">
        Takaisin
      </Link>
    </div>
  </form>
);

export default Register;
