import { db } from "../../db";
import { computeTokenHash } from "./token";
import { UserContext, UserRoles, UserType } from "../../lib/types";

export async function authenticateBearerToken(
  token: string
): Promise<UserContext> {
  const hash = computeTokenHash(token);
  const accessToken = await db.userToken.findUnique({ where: { hash: hash } });
  if (!accessToken) {
    return Promise.reject("Invalid token");
  }

  if (accessToken.expiresAt < new Date()) {
    return Promise.reject("Token expired");
  }

  const user = await db.user.findUnique({ where: { id: accessToken.userID } });

  if (!user) {
    return Promise.reject("Invalid token");
  }

  return Promise.resolve({
    uid: accessToken.userID,
    token: token,
    roles: [UserRoles.USER],
    type: UserType.DEVICE,
  });
}
