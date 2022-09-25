import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const createSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  // .min(8, "Password must be at least 8 characters")
  // .max(32, "Password must be at most 20 characters")
  // .refine(
  //   (value) => /[0-9]/.test(value),
  //   "Password must contain at least one number"
  // ),
});
