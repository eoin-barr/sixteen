import { User } from "@prisma/client";

import { db } from "./index";

export const getUser = async (id: number): Promise<User | null> =>
  db.user.findUnique({
    where: {
      id,
    },
  });

export const updateUser = async (id: number, data: Partial<User>) =>
  db.user.update({
    where: { id },
    data,
  });

export interface UpsertUserInput {
  email: string;
  githubID: number;
  githubUsername: string;
  githubAvatarUrl: string;
  githubAppInstalled?: boolean;
}

export const upsertUser = async (data: UpsertUserInput): Promise<User> => {
  const user = await db.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    return db.user
      .create({
        data: {
          ...data,
        },
      })
      .then((u: any) => {
        console.log("created user with id", u.id);
        return u;
      });
  }

  return db.user
    .update({
      where: { email: data.email },
      data: {
        githubID: data.githubID,
        githubUsername: data.githubUsername,
        githubAvatarUrl: data.githubAvatarUrl,
      },
    })
    .then((u: any) => {
      console.log("updated user with id", u.id);
      return u;
    });
};
