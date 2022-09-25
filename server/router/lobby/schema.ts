import { z } from "zod";

export const getSchema = z.object({
  id: z.string().min(1),
});

export const subscribeLobbySchema = z.object({
  id: z.string().min(1),
});

export const createSchema = z.object({
  name: z.string().min(1),
});

export const joinSchema = z.object({
  id: z.string().min(1),
});

export const leaveSchema = z.object({
  id: z.string().min(1),
});
