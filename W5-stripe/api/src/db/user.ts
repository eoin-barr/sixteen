import { User } from '@prisma/client';

import { db } from './index';

export const getUser = async (id: bigint): Promise<User | null> =>
  db.user.findUnique({
    where: {
      id,
    },
  });

export const updateUser = async (id: bigint, data: Partial<User>) =>
  db.user.update({
    where: { id },
    data,
  });

export interface UpsertUserInput {
  email: string;
  githubID: bigint;
  githubUsername: string;
  githubAvatarUrl: string;
  githubAppInstalled?: boolean;
  customerID?: string | null;
}

export const upsertUser = async (data: UpsertUserInput): Promise<User> => {
  const user = await db.user.findUnique({
    where: {
      email: data.email,
    },
  });

  console.log('inside');

  if (!user) {
    return db.user
      .create({
        data: {
          ...data,
        },
      })
      .then((u: any) => {
        console.log('created user with id', u.id);
        return u;
      });
  }

  console.log('ABOVE update suer');

  return db.user
    .update({
      where: { email: data.email },
      data: {
        githubID: data.githubID,
        githubUsername: data.githubUsername,
        githubAvatarUrl: data.githubAvatarUrl,
        customerID: data.customerID,
      },
    })
    .then((u: any) => {
      console.log('updated user with id', u.id);
      return u;
    });
};
