import { createSignal } from "solid-js";
import type { Component } from "solid-js";
import trpcClient from "trpc";
import { useNavigate } from "@solidjs/router";
import { Resource } from "solid-js";
import LobbyCreate from "./LobbyCreate";
import { LobbyType } from "trpc/types";

export type FormProps = {
  name: string;
  type: number;
};

export type FormErrors = Partial<Omit<FormProps, "type"> & { type?: string }>;

const LobbyCreateComponent: Component<{
  types: Resource<LobbyType[]>;
}> = (props) => {
  const navigate = useNavigate();

  const [form, setForm] = createSignal<FormProps>({
    name: "",
    type: 0,
  });

  const [error, setError] = createSignal<FormErrors>({
    name: "",
    type: "",
  });

  const handleSubmit = (submitData: FormProps) => {
    if (!submitData.name) {
      setError({
        name: "Nimi on pakollinen",
      });
      return;
    }
    if (!submitData.type) {
      setError({
        type: "Tyyppi on pakollinen",
      });
      return;
    }

    trpcClient.lobby.create.mutate(submitData).then(() => {
      navigate("/lobby/list"); //debug
    });
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
