import { z } from "zod";

export const createLobbySchema = z.object({
  name: z.string().min(1),
  ownerId: z.number().min(1),
});
