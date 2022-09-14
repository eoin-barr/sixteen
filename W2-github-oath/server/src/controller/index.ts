import { User } from "@prisma/client";
import { RequestHandler } from "express";
import { db, upsertUser, updateUser } from "../db";
import {
  COOKIE_NAME,
  createSessionCookie,
  getCookieFromRequest,
  getSessionFromCookie,
  MAX_AGE,
} from "../lib/auth/cookie";
import { createSecureToken } from "../lib/auth/token";
import {
  encryptGithubToken,
  getGithubUserInfo,
  githubExchangeCodeForAccessToken,
  GithubUserInfo,
} from "../lib/github";

export const login: RequestHandler = async (req, res) => {
  const { state, code } = req.query;

  if (!state || !code) {
    return res.status(400).send({ error: "Missing state or code" });
  }

  let githubInfo: GithubUserInfo;
  try {
    githubInfo = await githubExchangeCodeForAccessToken(
      code as string,
      state as string,
      ""
    ).then((token) => getGithubUserInfo(token));
  } catch (e) {
    return res
      .status(500)
      .send({ error: "Failed to authenticate with Github" });
  }

  try {
    const data = {
      email: githubInfo.email,
      githubID: githubInfo.databaseId,
      githubUsername: githubInfo.login,
      githubAvatarUrl: githubInfo.avatarUrl,
    };
    let user: User;
    try {
      user = await upsertUser(data);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: "Failed to create user" });
    }

    const expiresAt = new Date(Date.now() + MAX_AGE * 1000);
    const st = createSecureToken(expiresAt);

    await db.userToken
      .create({
        data: {
          hash: st.hash,
          userID: user.id,
          displayName: st.displayName,
          expiresAt: st.expiresAt,
        },
      })
      .catch((e: any) => {
        console.log(e);
        return res
          .status(500)
          .send({ message: "Failed to generate auth credentials" });
      });

    const session = { uid: Number(user.id), token: st.token };
    const cookie = await createSessionCookie(res, session);

    res.append("Set-Cookie", cookie);
    return res.status(200).end();
  } catch (error: any) {
    console.log(error);
    return res.status(error.status || 500).end(error.message);
  }
};

export const logout: RequestHandler = async (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
  });

  return res.status(200).end();
};

export const githubOAuth: RequestHandler = async (req, res) => {
  const { state, code, redirectURI } = req.query;

  const cookie = getCookieFromRequest(req.headers);
  const session = await getSessionFromCookie(cookie);

  if (!state || !code) {
    return res.status(400).send({ error: "missing state or code" });
  }

  let oauthToken;
  try {
    oauthToken = await githubExchangeCodeForAccessToken(
      code as string,
      state as string,
      redirectURI as string
    );
  } catch (e) {
    console.error(`Failed to exchange code for access token ${e}`);
    return res
      .status(500)
      .send({ error: "Failed to authenticate with Github" });
  }

  let token;
  try {
    token = await encryptGithubToken(oauthToken);
  } catch (e) {
    console.error(`Failed to encrypt token ${e}`);
    return res
      .status(500)
      .send({ error: "Failed to authenticate with Github" });
  }

  //@ts-ignore
  return updateUser(BigInt(session.uid), { githubOauthToken: token })
    .catch((e) => {
      console.error(`Couldn't update user wth Github access token: ${e}`);
      return res
        .status(500)
        .send({ error: "Failed to authenticate with Github" });
    })
    .then(() => res.status(200).send({ message: "success" }));
};
