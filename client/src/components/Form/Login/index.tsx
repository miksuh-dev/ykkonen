import { createSignal } from "solid-js";
// import { Link } from "@solidjs/router";
import type { Component } from "solid-js";
import Login from "./Login";
import useAuth from "hooks/useAuth";

type FormProps = {
  username: string;
  password: string;
};

const LoginComponent: Component = () => {
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

  const handleSubmit = async (submitData: FormProps) => {
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
