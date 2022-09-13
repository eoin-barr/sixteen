import Iron from "@hapi/iron";
import { Response } from "express";
import { parse, serialize } from "cookie";
import { IncomingHttpHeaders } from "http";

import { db } from "../../db";
import { UserContext, UserRoles, UserType } from "../types";

export const COOKIE_NAME = "auth";
export const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionCookie {
  uid: number;
  token: string;
  createdAt?: number;
  maxAge?: number;
}

export function getCookieFromRequest(haeders: IncomingHttpHeaders) {
  const cookies = parse(haeders.cookie || "");
  return cookies[COOKIE_NAME];
}

export async function getSessionFromCookie(
  token: string
): Promise<SessionCookie> {
  let session: SessionCookie;

  try {
    session = await Iron.unseal(
      token,
      process.env.APP_SECRET as string,
      Iron.defaults
    );
  } catch (err) {
    console.log("Invalid cookie:", err);
    throw new Error("Invalid session");
  }

  if (!session || !session.uid) {
    throw new Error("Invalid session");
  }

  const expiresAt = session.createdAt! + session.maxAge! * 1000;

  if (Date.now() > expiresAt) {
    throw new Error("Invalid session");
  }

  return session;
}

export async function authenticateCookie(token: string): Promise<UserContext> {
  const session = await getSessionFromCookie(token);
  const user = await db.user.findUnique({ where: { id: session.uid } });

  if (!user) {
    return Promise.reject("Invalid session");
  }

  return Promise.resolve({
    uid: user.id,
    token: session.token,
    roles: [UserRoles.USER],
    type: UserType.WEB,
  });
}

export async function createSessionCookie(
  res: Response,
  session: SessionCookie
) {
  const createdAt = Date.now();
  const cook: SessionCookie = { ...session, createdAt, maxAge: MAX_AGE };
  const token = await Iron.seal(
    cook,
    process.env.APP_SECRET as string,
    Iron.defaults
  );

  return serialize(COOKIE_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
  });
}
