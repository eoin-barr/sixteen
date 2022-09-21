import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

import { db } from "./db";

export interface Context {
  db: PrismaClient;
  pubsub: typeof pubsub;
}

export const context: Context = {
  db,
  pubsub,
};
