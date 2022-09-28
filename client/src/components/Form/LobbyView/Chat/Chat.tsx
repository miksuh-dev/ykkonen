import type { Component } from "solid-js";
import { Accessor, Setter, Resource, Show, For } from "solid-js";
import { Lobby } from "trpc/types";
import { DateTime } from "luxon";

type Props = {
  lobby: Resource<Lobby>;
  message: Accessor<string>;
  onChange: Setter<string>;
  onSubmit: (data: string) => void;
  ref: HTMLDivElement | undefined;
};

const LobbyChat: Component<Props> = (props) => {
  return (
    <Show
      when={props.lobby()?.messages}
      fallback={
        <div class="flex flex-col items-center text-white">Ei pelaajia</div>
      }
    >
      <div class="flex bg-white p-2 flex-col h-full">
        <div class="flex-1 overflow-y-auto min-h-[500px] max-h-[500px]">
          <For each={props.lobby()?.messages}>
            {(message) => (
              <div class="flex space-x-2">
                <div>
                  {DateTime.fromSeconds(message.timestamp).toFormat("HH:mm:ss")}
                </div>
                <div class="font-bold">{message.username}:</div>
                <div>{message.content}</div>
              </div>
            )}
          </For>
          <div ref={props.ref} />
        </div>
        <form class="flex" onSubmit={(e) => e.preventDefault()}>
          <input
            id="chat"
            type="text"
            class="block p-2.5 mx-2 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your message..."
            onChange={(e) => props.onChange(e.currentTarget.value)}
            value={props.message()}
          />
          <button
            type="submit"
            class="inline-flex justify-center  p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
            onClick={() => props.onSubmit(props.message())}
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 rotate-90 fill-custom-aqua-700 before"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
            <span class="sr-only">Send message</span>
          </button>
        </form>
      </div>
    </Show>
  );
};

export default LobbyChat;
