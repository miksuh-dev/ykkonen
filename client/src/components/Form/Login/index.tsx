import { createSignal } from "solid-js";
import type { Component } from "solid-js";
import Login from "./Login";
import useAuth from "hooks/useAuth";
import { UserLoginInput } from "trpc/types";
import { handleError } from "utils/error";

export type FormError = Partial<UserLoginInput> & {
  general: string;
};

const LoginComponent: Component = () => {
  const auth = useAuth();

  const [form, setForm] = createSignal<UserLoginInput>({
    username: "",
    password: "",
  });

  const [error, setError] = createSignal<FormError>({
    username: "",
    password: "",
    general: "",
  });

  const handleSubmit = async (submitData: UserLoginInput) => {
    try {
      await auth.action.login(submitData);
    } catch (err) {
      const errors = handleError(err);
      if (errors) setError(errors);
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
