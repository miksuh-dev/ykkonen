import type { Component } from "solid-js";
import { Resource, createSignal, createEffect, on, onCleanup } from "solid-js";
import trpcClient from "trpc";
import { LobbyInside, IncomingMessage } from "trpc/types";
import useSnackbar from "hooks/useSnackbar";
import Chat from "./Chat";

type Props = {
  lobby: Resource<LobbyInside>;
};

const LobbyChat: Component<Props> = (props) => {
  const snackbar = useSnackbar();
  const [message, setMessage] = createSignal("");
  const [messages, setMessages] = createSignal<IncomingMessage>([]);

  createEffect(() => {
    const lobbyId = props.lobby()?.id;
    if (!lobbyId) {
      return;
    }

    const lobbyUpdate = trpcClient.lobby.onMessage.subscribe(
      { lobbyId },
      {
        onData(incomingMessage) {
          setMessages(messages().concat(incomingMessage).slice(-100));
        },
        onError(err) {
          snackbar.error(err.message);
          console.error("error", err);
        },
      }
    );

    onCleanup(() => {
      lobbyUpdate.unsubscribe();
    });
  });

  const handleSendMessage = async (content: string) => {
    try {
      const lobbyId = props.lobby()?.id;
      if (!lobbyId) {
        return;
      }

      await trpcClient.lobby.message.mutate({
        lobbyId,
        content,
      });

      setMessage("");
    } catch (e) {
      if (e instanceof Error) {
        console.log("e", e);
      }
    }
  };

  let ref: HTMLDivElement | undefined = undefined;

  createEffect(
    on(
      messages,
      (messages) => {
        if (messages.length && ref) {
          ref.scrollIntoView({ behavior: "smooth" });
        }
      },
      { defer: true }
    )
  );

  return (
    <Chat
      currentMessage={message}
      messages={messages}
      onChange={setMessage}
      onSubmit={(data) => handleSendMessage(data)}
      ref={ref}
    />
  );
};

export default LobbyChat;
