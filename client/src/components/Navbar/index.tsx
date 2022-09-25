import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";
import useAuth from "hooks/useAuth";

const Navbar: Component = () => {
  const [menuOpen, setMenuOpen] = createSignal(false);
  const auth = useAuth();

  return (
    <nav class="absolute top-0 left-0 right-0 bg-neutral-900 border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
      <div class="container flex flex-wrap justify-between items-center mx-auto">
        <span class="self-center text-xl font-semibold whitespace-nowrap text-white">
          Ykkönen
        </span>
        <div class="flex items-center md:order-2">
          <button
            type="button"
            class="flex mr-3 text-sm bg-custom-aqua-900 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
            onClick={() => setMenuOpen(!menuOpen())}
          >
            <span class="sr-only">Open user menu</span>
            <div class="w-8 h-8 rounded-full">
              <div class="avatar online placeholder">
                <span class="text-xl bold text-white">
                  {auth.user()?.username.substring(0, 2) ?? ""}
                </span>
              </div>
            </div>
          </button>
          <Show when={menuOpen()}>
            <div class="relative">
              <div
                class="w-[150px] absolute right-0 top-4 z-50 my-4 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                id="user-dropdown"
              >
                <div class="py-3 px-4">
                  <span class="block text-sm text-gray-900 dark:text-white">
                    {auth.user()?.username}
                  </span>
                  {/* <span class="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                      name@flowbite.com
                    </span> */}
                </div>
                <ul class="py-1" aria-labelledby="user-menu-button">
                  <li>
                    <button
                      onClick={() => auth.action.logout()}
                      class="w-full text-left block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
