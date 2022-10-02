import type { Component } from "solid-js";
import { Accessor } from "solid-js";
import { createSignal, createEffect, on } from "solid-js";
import trpcClient from "trpc";
import Chat from "./Chat";
import { IncomingMessage } from "trpc/types";
import { useParams } from "@solidjs/router";

type Props = {
  messages: Accessor<IncomingMessage[]>;
};

const LobbyChat: Component<Props> = (props) => {
  const [message, setMessage] = createSignal("");
  const params = useParams();

  let ref: HTMLDivElement | undefined = undefined;

  const handleSendMessage = async (content: string) => {
    try {
      const lobbyId = Number(params.id);
      if (!lobbyId || !content) {
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

  createEffect(
    on(
      props.messages,
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
      messages={props.messages}
      onChange={setMessage}
      onSubmit={(data) => handleSendMessage(data)}
      ref={ref}
    />
  );
};

export default LobbyChat;
