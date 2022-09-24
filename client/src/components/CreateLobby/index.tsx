import { createSignal } from "solid-js";
import type { Component } from "solid-js";
import trpcClient from "trpc";
import { useNavigate } from "@solidjs/router";

type FormProps = {
  name: string;
};

const CreateLobby: Component = () => {
  const navigate = useNavigate();
  const [form, setForm] = createSignal<FormProps>({
    name: "",
  });

  const [error, setError] = createSignal<Partial<FormProps>>({
    name: "",
  });

  const handleCreateLobby = async (data: typeof form) => {
    const submitData = data();

    if (!submitData.name) {
      setError({
        name: "Nimi on pakollinen",
      });
      return;
    }
    const res = await trpcClient.mutation("lobby.createLobby", submitData);
    navigate(`/lobby/${res.id}`);
  };

  return (
    <div class="container flex mx-auto justify-center flex-col pt-16 pb-2 md:pb-4 px-2 md:px-0">
      <div class="flex justify-center flex-col items-center">
        <div class="block space-y-4">
          <div class="flex">
            <div>
              <label for="first_name" class="block mb-2 text-primary">
                Huoneen nimi
              </label>
              <input
                type="text"
                id="first_name"
                class="input-primary"
                required
                value={form().name}
                onChange={(e) =>
                  setForm({ ...form(), name: e.currentTarget.value })
                }
              />
              {error().name && <div class="text-red-500">{error().name}</div>}
            </div>
          </div>
          <div class="w-full">
            <button
              class="btn-primary-full"
              onClick={() => handleCreateLobby(form)}
            >
              Luo huone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLobby;
