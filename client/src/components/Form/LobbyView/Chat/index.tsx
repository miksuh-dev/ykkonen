import type { Component } from "solid-js";
import { Resource, createSignal, createEffect, on } from "solid-js";
import { Lobby } from "trpc/types";
import useSnackbar from "hooks/useSnackbar";
import Chat from "./Chat";

type Props = {
  lobby: Resource<Lobby>;
  sendMessage: (message: string) => void;
};

const LobbyChat: Component<Props> = (props) => {
  const snackbar = useSnackbar();
  const [message, setMessage] = createSignal("");

  const handleSubmit = (message: string) => {
    try {
      props.sendMessage(message);
      setMessage("");
    } catch (err) {
      if (err instanceof Error) {
        snackbar.error(err.message);
      }
    }
  };

  let ref: HTMLDivElement | undefined = undefined;

  createEffect(
    on(
      props.lobby,
      (lobby) => {
        if (lobby?.messages.length && ref) {
          ref.scrollIntoView({ behavior: "smooth" });
        }
      },
      { defer: true }
    )
  );

  return (
    <Chat
      lobby={props.lobby}
      message={message}
      onChange={setMessage}
      onSubmit={(data) => handleSubmit(data)}
      ref={ref}
    />
  );
};

export default LobbyChat;
