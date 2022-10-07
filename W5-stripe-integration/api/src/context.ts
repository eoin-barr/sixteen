import { PrismaClient } from '@prisma/client';

import { db } from './db';

export interface Context {
  db: PrismaClient;
  req?: any;
}

export const context: Context = {
  db,
};
