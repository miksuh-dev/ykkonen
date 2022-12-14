import type { Component } from "solid-js";
import { createSignal, Show } from "solid-js";
import { Link } from "@solidjs/router";
import useAuth from "hooks/useAuth";

const Navbar: Component = () => {
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = createSignal(false);

  return (
    <nav class=" rounded border-gray-200 bg-neutral-900 px-2 py-2.5 dark:bg-gray-900 sm:px-4">
      <div class="container mx-auto flex flex-wrap items-center justify-between">
        <Link
          href="/"
          class="self-center whitespace-nowrap text-xl font-semibold text-white"
        >
          Ykkönen
        </Link>
        <div class="flex items-center md:order-2">
          <button
            type="button"
            class="mr-3 flex rounded-full bg-custom-aqua-900 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 md:mr-0"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
            onClick={() => setMenuOpen(!menuOpen())}
          >
            <span class="sr-only">Open user menu</span>
            <div class="h-8 w-8 rounded-full">
              <div class="avatar online placeholder">
                <span class="bold text-xl text-white">
                  {auth.user()?.username.substring(0, 2) ?? ""}
                </span>
              </div>
            </div>
          </button>
          <Show when={menuOpen()}>
            <div class="relative">
              <div
                class="absolute right-0 top-4 z-50 my-4 w-[150px] list-none divide-y divide-gray-100 rounded bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
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
                      class="block w-full py-2 px-4 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Kirjaudu ulos
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
