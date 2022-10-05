import { Link } from "@solidjs/router";
import type { Component } from "solid-js";
import { For } from "solid-js";
import { Accessor, Setter } from "solid-js";
import { LobbyCreateInput } from "trpc/types";
import { FormErrors } from "./index";
import { RouteData } from "./index";

type Props = {
  form: Accessor<LobbyCreateInput>;
  types: RouteData[0];
  onChange: Setter<LobbyCreateInput>;
  error: Accessor<FormErrors>;
  onSubmit: (data: LobbyCreateInput) => void;
};

const CreateLobby: Component<Props> = (props) => (
  <div class="block space-y-8">
    <div>
      <label for="first_name" class="text-primary mb-2 block">
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
    <div>
      <label for="type" class="text-primary mb-2 block">
        Huoneen tyyppi
      </label>
      <select
        id="type"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-custom-aqua-500 focus:ring-custom-aqua-500"
        value={props.form().type}
        onChange={(e) => {
          props.onChange({
            ...props.form(),
            type: parseInt(e.currentTarget.value),
          });
        }}
      >
        <option selected value="0">
          Valitse tyyppi
        </option>
        <For each={props.types()}>
          {(type) => <option value={type.id}>{type.name}</option>}
        </For>
      </select>
      {props.error().type && (
        <div class="text-red-500">{props.error().type}</div>
      )}
    </div>
    {props.error().general && (
      <div class="text-red-500">{props.error().general}</div>
    )}
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
