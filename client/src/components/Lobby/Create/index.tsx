import { createSignal } from "solid-js";
import type { Component } from "solid-js";
import trpcClient from "trpc";
import { useNavigate, useRouteData } from "@solidjs/router";
import LobbyCreate from "./LobbyCreate";
import { LobbyCreateInput } from "trpc/types";
import { handleError } from "utils/error";
import data from "view/Lobby/Create/data";

export type FormErrors = Partial<
  Omit<LobbyCreateInput, "type"> & { type: string; general: string }
>;

export type RouteData = ReturnType<typeof data>;

const LobbyCreateComponent: Component = () => {
  const navigate = useNavigate();
  const [types] = useRouteData<RouteData>();

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
      const lobby = await trpcClient.lobby.create.mutate(submitData);

      navigate(`/lobby/${lobby.id}`);
    } catch (err) {
      const errors = handleError(err);
      if (errors) setError(errors);
    }
  };

  return (
    <LobbyCreate
      form={form}
      error={error}
      types={types}
      onChange={setForm}
      onSubmit={handleSubmit}
    />
  );
};

export default LobbyCreateComponent;
