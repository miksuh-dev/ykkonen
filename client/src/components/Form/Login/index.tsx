import { createSignal } from "solid-js";
// import { Link } from "@solidjs/router";
import type { Component } from "solid-js";
import Login from "./Login";
import useAuth from "hooks/useAuth";

const LoginComponent: Component = () => {
  const auth = useAuth();
  //
  const [form, setForm] = createSignal({
    username: "",
    password: "",
  });

  const [error, setError] = createSignal<Partial<typeof form>>({
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
    <Login
      form={form}
      error={error}
      onChange={setForm}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginComponent;
