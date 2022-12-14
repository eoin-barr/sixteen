import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();

interface CheckDbConnectionPluginOptions {
  db: PrismaClient;
}

export function CheckDbConnectionPlugin(options: CheckDbConnectionPluginOptions) {
  return {
    async serverWillStart() {
      console.log('Checking database connection...');
      return options.db.$connect().then((res: any) => {
        console.log('Database connection established');
        return res;
      });
    },
  };
}
