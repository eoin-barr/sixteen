import { PrismaClient } from "@prisma/client";

import { db } from "./db";
import { UserContext } from "./lib/types";

export interface Context {
  db: PrismaClient;
  user: UserContext;
}

export const context: Context = {
  db,
  user: {
    uid: null,
    token: null,
    roles: null,
    type: null,
  },
};
