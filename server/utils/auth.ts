import { IncomingMessage } from "http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
import { UserWithoutPassword } from "../type/prisma";

function exclude<User, Key extends keyof User>(
  user: User,
  ...keys: Key[]
): Omit<User, Key> {
  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete user[key];
  }

  return user;
}

const getTokenFromHeader = (headers: IncomingMessage["headers"]) => {
  const authorization = headers.authorization;
  if (!authorization) {
    return null;
  }

  const token = authorization.replace("Bearer ", "");
  return token;
};

export const getTokenFromUrl = (url: string) => {
  const token = url.replace("/?token=", "");
  if (!token) return null;

  return token;
};

export const getUserFromRequest = async (
  headers: IncomingMessage["headers"],
  url: string
) => {
  const token = getTokenFromHeader(headers) ?? getTokenFromUrl(url);
  if (!token) return null;

  try {
    const user = await verifyJWTToken(token);
    return user;
  } catch (err) {
    return null;
  }
};

export const verifyJWTToken = async (token: string) => {
  const authSecret = process.env.AUTH_TOKEN_SECRET;
  if (!authSecret) {
    throw new Error("No token data");
  }

  try {
    const data = jwt.verify(token, authSecret) as UserWithoutPassword;

    const user = await prisma.user.findFirst({
      where: {
        id: data.id,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    return exclude(user, "password");
  } catch (err) {
    throw new Error("Invalid token");
  }
};

export const createSession = (userData: UserWithoutPassword) => {
  const authSecret = process.env.AUTH_TOKEN_SECRET;
  if (!authSecret) {
    throw new Error("No token data");
  }

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
