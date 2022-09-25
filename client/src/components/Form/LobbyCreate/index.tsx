import { createSignal } from "solid-js";
import type { Component } from "solid-js";
import trpcClient from "trpc";
import { useNavigate } from "@solidjs/router";
import LobbyCreate from "./LobbyCreate";

type FormProps = {
  name: string;
};

const LobbyCreateComponent: Component = () => {
  const navigate = useNavigate();
  const [form, setForm] = createSignal<FormProps>({
    name: "",
  });

  const [error, setError] = createSignal<Partial<FormProps>>({
    name: "",
  });

  const handleSubmit = async (data: typeof form) => {
    const submitData = data();

    if (!submitData.name) {
      setError({
        name: "Nimi on pakollinen",
      });
      return;
    }
    const res = await trpcClient.lobby.create.mutate(submitData);
    console.log("res", res);
    // navigate(`/lobby/${res.id}`);
    navigate("/lobby/list"); //debug
  };

  return (
    <LobbyCreate
      form={form}
      error={error}
      onChange={setForm}
      onSubmit={handleSubmit}
    />
  );
};

export default LobbyCreateComponent;
