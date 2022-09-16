import Iron from "@hapi/iron";
import fetch from "node-fetch";
import { Octokit } from "octokit";
import { sign as signJWT } from "jsonwebtoken";
import { gql, GraphQLClient } from "graphql-request";
import { db } from "../../db";
import { GqlUnauthorizedError } from "../errors/gql";

export interface GithubUserInfo {
  login: string;
  email: string;
  avatarUrl: string;
  databaseId: bigint;
}

export function encryptGithubToken(token: string) {
  return Iron.seal(token, process.env.APP_SECRET as string, Iron.defaults);
}

export function decryptGithubToken(token: string) {
  return Iron.unseal(token, process.env.APP_SECRET as string, Iron.defaults);
}

export async function githubExchangeCodeForAccessToken(
  code: string,
  state: string,
  redirectURI: string
): Promise<string | never> {
  const base = `https://github.com/login/oauth/access_token`;
  const params = `?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}&state=${state}&redirect_uri=${redirectURI}`;
  const url = base + params;

  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error("Failed to exhange OAuth code for access token");
      }
      console.log("res", res);
      return res.json();
    })
    .then((data: any) => data.access_token)
    .catch((error) => {
      console.log("Failing inside githubExchangeCodeForAccessToken");
      console.log(error);
      return Promise.reject(error);
    });
}

export async function getGithubUserInfo(token: string) {
  console.log("TOKEN", token);
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.request("GET /user/emails");
  const email = data.find((e: any) => e.primary)?.email;

  if (!email) {
    return Promise.reject(new GqlUnauthorizedError("No user email found"));
  }

  const client = new GraphQLClient("https://api.github.com/graphql", {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const query = gql`
    query {
      viewer {
        login
        avatarUrl
        databaseId
      }
    }
  `;
  return client
    .request(query, {})
    .then((d: any) => ({
      email: email,
      ...d.viewer,
    }))
    .catch((e) => {
      console.error("Failed to get Github user info");
      return Promise.reject(e);
    });
}

export async function githubOauthTokenIsValid(
  userID: bigint
): Promise<boolean> {
  return db.user
    .findUnique({
      where: {
        id: userID,
      },
    })
    .then(async (user) => {
      if (!user) {
        return false;
      }

      if (!user.githubOauthToken) {
        return false;
      }

      const token = await decryptGithubToken(user.githubOauthToken).catch(
        (e) => {
          console.error("Couldn't decrypt github access token", e);
          return null;
        }
      );

      const octokit = new Octokit({
        auth: token,
      });

      return octokit.rest.users
        .getAuthenticated()
        .then(() => true)
        .catch(() => false);
    });
}
