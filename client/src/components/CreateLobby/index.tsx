import { createSignal } from "solid-js";
import type { Component } from "solid-js";
// import { trpcClient } from "client";

const CreateLobby: Component = () => {
  const [name, setName] = createSignal<string>("");

  const handleCreateLobby = async (name: string) => {
    console.log("name", name);
    // const res = await trpcClient.mutation("lobby.createLobby", { name });
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
                value={name()}
                onChange={(e) => setName(e.currentTarget.value)}
              />
            </div>
          </div>
          <div class="w-full">
            <button
              class="btn-primary-full"
              onClick={() => handleCreateLobby(name())}
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
