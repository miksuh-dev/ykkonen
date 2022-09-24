import { IncomingMessage } from "http";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma";

export const getUserFromHeader = async (
  headers: IncomingMessage["headers"]
) => {
  const authHeader = headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.replace("Bearer ", "");

      const user = await verifyJWTToken(token);
      return user;
    } catch (err) {
      return null;
    }
  }
  return null;
};

export const verifyJWTToken = async (token: string) => {
  const authSecret = process.env.AUTH_TOKEN_SECRET;
  if (!authSecret) {
    throw new Error("No token data");
  }

  try {
    const data = jwt.verify(token, authSecret) as Partial<User>;

    const user = await prisma.user.findFirst({
      where: {
        id: data.id,
      },
    });
    return user;
  } catch (err) {
    throw new Error("Invalid token");
  }
};

export const createSession = (user: User) => {
  const authSecret = process.env.AUTH_TOKEN_SECRET;
  if (!authSecret) {
    throw new Error("No token data");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userData } = user;

  const token = jwt.sign(userData, authSecret, {
    expiresIn: "15d",
  });

  return token;
};

export const hashPassword = async (plaintextPassword: string) => {
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(plaintextPassword, salt);
};

export const comparePassword = (plaintextPassword: string, hash: string) => {
  return bcrypt.compare(plaintextPassword, hash);
};
