import { Accessor, Setter } from "solid-js";
import { Link } from "@solidjs/router";
import type { Component } from "solid-js";
import { UserRegisterInput } from "trpc/types";
import { FormError } from "./index";

type Props = {
  form: Accessor<UserRegisterInput>;
  onChange: Setter<UserRegisterInput>;
  error: Accessor<Partial<FormError>>;
  onSubmit: (data: UserRegisterInput) => void;
};

const Register: Component<Props> = (props) => (
  <form class="block space-y-6" onSubmit={(e) => e.preventDefault()}>
    <div class="flex flex-col space-y-4">
      <div>
        <label for="username" class="text-primary mb-2 block">
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
        <label for="password" class="text-primary mb-2 block">
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
        <label for="passwordAgain" class="text-primary mb-2 block">
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
      {props.error().general && (
        <div class="text-red-500">{props.error().general}</div>
      )}
    </div>
    <div class="w-full space-y-4">
      <button
        class="btn-primary-full"
        onClick={() => props.onSubmit(props.form())}
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
