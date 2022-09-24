import type { Component } from "solid-js";
import RegisterForm from "components/RegisterForm";
import Center from "components/Center";

const Register: Component = () => {
  return (
    <Center>
      <div class="container flex mx-auto justify-center flex-col pt-16 pb-2 md:pb-4 px-2 md:px-0">
        <div class="flex justify-center flex-col items-center">
          <div class="block space-y-4">
            <div class="flex flex-col space-y-4">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </Center>
  );
};

export default Register;
