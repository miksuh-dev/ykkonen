import { createSignal } from "solid-js";
import type { Component } from "solid-js";
import trpcClient from "trpc";
import { useNavigate } from "@solidjs/router";
import { Resource } from "solid-js";
import LobbyCreate from "./LobbyCreate";
import { LobbyType, LobbyCreateInput } from "trpc/types";
import { handleError } from "utils/error";

export type FormErrors = Partial<
  Omit<LobbyCreateInput, "type"> & { type: string; general: string }
>;

const LobbyCreateComponent: Component<{
  types: Resource<LobbyType[]>;
}> = (props) => {
  const navigate = useNavigate();

  const [form, setForm] = createSignal<LobbyCreateInput>({
    name: "",
    type: 0,
  });

  const [error, setError] = createSignal<FormErrors>({
    name: "",
    type: "",
  });

  const handleSubmit = async (submitData: LobbyCreateInput) => {
    try {
      await trpcClient.lobby.create.mutate(submitData);

      navigate("/lobby/list"); //debug
    } catch (err) {
      const errors = handleError(err);
      if (errors) setError(errors);
    }
  };

  return (
    <LobbyCreate
      form={form}
      error={error}
      types={props.types}
      onChange={setForm}
      onSubmit={handleSubmit}
    />
  );
};

export default LobbyCreateComponent;
