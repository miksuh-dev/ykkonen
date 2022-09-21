import { createSignal } from "solid-js";
import { trpcClient } from "client";
import { Link } from "@solidjs/router";
import type { Component } from "solid-js";

type FormProps = {
  username: string;
  password: string;
  passwordAgain: string;
};

const RegisterForm: Component = () => {
  const [form, setForm] = createSignal<FormProps>({
    username: "",
    password: "",
    passwordAgain: "",
  });

  const [error, setError] = createSignal<Partial<FormProps>>({
    username: "",
    password: "",
    passwordAgain: "",
  });

  const handleRegister = async (data: typeof form) => {
    const submitData = data();

    if (submitData.password !== submitData.passwordAgain) {
      setError({
        password: "Passwords don't match",
        passwordAgain: "Passwords don't match",
      });
      return;
    }

    const res = await trpcClient.mutation("user.create", {
      username: submitData.username,
      password: submitData.password,
    });
    console.log("res", res);
  };

  return (
    <div class="container flex mx-auto justify-center flex-col pt-16 pb-2 md:pb-4 px-2 md:px-0">
      <div class="flex justify-center flex-col items-center">
        <div class="block space-y-4">
          <div class="flex flex-col space-y-4">
            <div>
              <label for="username" class="block mb-2 text-primary">
                Käyttäjänimi:
              </label>
              <input
                type="text"
                id="username"
                class="input-primary"
                required
                value={form().username}
                onChange={(e) =>
                  setForm({ ...form(), username: e.currentTarget.value })
                }
              />
            </div>
            {error().username && (
              <div class="text-red-500">{error().username}</div>
            )}
            <div>
              <label for="password" class="block mb-2 text-primary">
                Salasana
              </label>
              <input
                type="password"
                id="username"
                class="input-primary"
                required
                value={form().password}
                onChange={(e) =>
                  setForm({ ...form(), password: e.currentTarget.value })
                }
              />
              {error().password && (
                <div class="text-red-500">{error().password}</div>
              )}
            </div>
            <div>
              <label for="passwordAgain" class="block mb-2 text-primary">
                Salasana uudelleen
              </label>
              <input
                type="passwordAgain"
                id="username"
                class="input-primary"
                required
                value={form().passwordAgain}
                onChange={(e) =>
                  setForm({ ...form(), passwordAgain: e.currentTarget.value })
                }
              />
              {error().passwordAgain && (
                <div class="text-red-500">{error().passwordAgain}</div>
              )}
            </div>
          </div>
          <div class="w-full space-y-4">
            <button
              class="btn-primary-full"
              onClick={() => handleRegister(form)}
            >
              Rekisteröidy
            </button>
            <Link class="btn-secondary-full" href="/login">
              Takaisin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
