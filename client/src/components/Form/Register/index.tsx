import { createSignal } from "solid-js";
import useAuth from "hooks/useAuth";
import type { Component } from "solid-js";
import Register from "./Register";
import { UserRegisterInput } from "trpc/types";
import { handleError } from "utils/error";

export type FormError = Partial<UserRegisterInput> & {
  general: string;
};

const RegisterComponent: Component = () => {
  const auth = useAuth();

  const [form, setForm] = createSignal<UserRegisterInput>({
    username: "",
    password: "",
    passwordAgain: "",
  });

  const [error, setError] = createSignal<FormError>({
    username: "",
    password: "",
    passwordAgain: "",
    general: "",
  });

  const handleSubmit = async (submitData: UserRegisterInput) => {
    try {
      await auth.action.register(submitData);
    } catch (err) {
      const errors = handleError(err);
      if (errors) setError(errors);
    }
  };

  return (
    <Register
      form={form}
      error={error}
      onChange={setForm}
      onSubmit={handleSubmit}
    />
  );
};

export default RegisterComponent;
