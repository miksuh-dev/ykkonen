import { Link } from "@solidjs/router";
import type { Component } from "solid-js";
import { For } from "solid-js";
import { LobbyType } from "trpc/types";
import { Resource } from "solid-js";
import { Accessor, Setter } from "solid-js";
import { LobbyCreateInput } from "trpc/types";
import { FormErrors } from "./index";

type Props = {
  form: Accessor<LobbyCreateInput>;
  types: Resource<LobbyType[]>;
  onChange: Setter<LobbyCreateInput>;
  error: Accessor<FormErrors>;
  onSubmit: (data: LobbyCreateInput) => void;
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
    <div>
      <label for="type" class="block mb-2 text-primary">
        Huoneen tyyppi
      </label>
      <select
        id="type"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-custom-aqua-500 focus:border-custom-aqua-500 block w-full p-2.5"
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
