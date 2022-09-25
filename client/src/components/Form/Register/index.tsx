import { createSignal } from "solid-js";
import useAuth from "hooks/useAuth";
import type { Component } from "solid-js";
import Register from "./Register";

type FormProps = {
  username: string;
  password: string;
  passwordAgain: string;
};

const RegisterComponent: Component = () => {
  const auth = useAuth();

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

  const handleSubmit = async (data: typeof form) => {
    const submitData = data();

    if (submitData.password !== submitData.passwordAgain) {
      setError({
        password: "Passwords don't match",
        passwordAgain: "Passwords don't match",
      });
      return;
    }

    try {
      await auth.action.register(submitData.username, submitData.password);
    } catch (err) {
      if (err instanceof Error) {
        setError({ username: err.message });
      }
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
