import { Link } from "@solidjs/router";
import type { Component } from "solid-js";
import { Accessor, Setter } from "solid-js";

type FormProps = {
  name: string;
};

type Props = {
  form: Accessor<FormProps>;
  onChange: Setter<FormProps>;
  error: Accessor<Partial<FormProps>>;
  onSubmit: (data: FormProps) => void;
};

const CreateLobby: Component<Props> = (props) => (
  <div class="block space-y-8">
    <div>
      <label for="first_name" class="block mb-2 text-primary">
        Huoneen nimi
      </label>
      <input
        type="text"
        id="first_name"
        class="input-primary"
        required
        value={props.form().name}
        onChange={(e) =>
          props.onChange({ ...props.form(), name: e.currentTarget.value })
        }
      />
      {props.error().name && (
        <div class="text-red-500">{props.error().name}</div>
      )}
    </div>
    <div class="w-full space-y-4">
      <button
        class="btn-primary-full"
        onClick={() => props.onSubmit(props.form())}
      >
        Luo huone
      </button>
      <Link class="btn-secondary-full" href="/lobby/list">
        Takaisin
      </Link>
    </div>
  </div>
);

export default CreateLobby;
