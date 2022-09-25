import { createSignal } from "solid-js";
// import { trpcClient } from "client";
import { Link } from "@solidjs/router";
import type { Component } from "solid-js";
import useAuth from "hooks/useAuth";

type FormProps = {
  username: string;
  password: string;
};

const LoginForm: Component = () => {
  const auth = useAuth();
  //
  const [form, setForm] = createSignal<FormProps>({
    username: "",
    password: "",
  });

  const [error, setError] = createSignal<Partial<FormProps>>({
    username: "",
    password: "",
  });

  const handleSubmit = async (data: typeof form) => {
    const submitData = data();

    if (!submitData.username || !submitData.password) {
      setError({
        username: "Please enter a username",
        password: "Please enter a password",
      });
      return;
    }

    try {
      await auth.action.login(submitData.username, submitData.password);
    } catch (err) {
      if (err instanceof Error) {
        setError({ username: err.message });
      }
    }
  };

  return (
    <div class="container flex mx-auto justify-center flex-col pt-16 pb-2 md:pb-4 px-2 md:px-0">
      <div class="flex justify-center flex-col items-center">
        <div class="block space-y-4">
          <div class="flex flex-col space-y-4">
            <div>
              <label for="first_name" class="block mb-2 text-primary">
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
              {error().username && (
                <div class="text-red-500 text-sm">{error().username}</div>
              )}
            </div>
            <div>
              <label for="first_name" class="block mb-2 text-primary">
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
                <div class="text-red-500 text-sm">{error().password}</div>
              )}
            </div>
          </div>
          <div class="w-full space-y-4">
            <button class="btn-primary-full" onClick={() => handleSubmit(form)}>
              Kirjaudu sisään
            </button>

            <Link class="btn-secondary-full" href="/register">
              Luo tunnus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;