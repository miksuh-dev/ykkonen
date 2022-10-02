import { Message } from "./state";

export interface IncomingMessage {
  lobbyId: number;
  message: Message;
}
