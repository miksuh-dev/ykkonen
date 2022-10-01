import { User } from "@prisma/client";

export type Player = Omit<User, "password">;
