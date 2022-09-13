import { PrismaClient } from "@prisma/client";
export * from "./user";

export const db = new PrismaClient();

interface CheckDbConnectionPluginOptions {
  db: PrismaClient;
}

export function CheckDbConnectionPlugin(
  options: CheckDbConnectionPluginOptions
) {
  return {
    async serverWillStart() {
      console.log("Checking database connection...");
      return options.db.$connect().then((res) => {
        console.log("Database connection established");
        return res;
      });
    },
  };
}
