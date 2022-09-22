import { db } from "./db";
import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

export interface Context {
  db: PrismaClient;
  pubsub: typeof pubsub;
}

export const context = {
  db,
  pubsub,
};
