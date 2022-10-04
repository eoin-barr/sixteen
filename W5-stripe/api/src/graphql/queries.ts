import { extendType, nonNull, stringArg } from 'nexus';
import { getUser, updateUser } from '../db';
import { GqlUnauthorizedError } from '../lib/errors';
import { upsertCustomer, upsertSetupIntent } from '../lib/stripe';
import { uuidArg } from './scalars';

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      async resolve(_, __, ctx) {
        if (!ctx.user.uid) {
          throw new GqlUnauthorizedError('Not authenticated');
        }

        const user = await getUser(ctx.user.uid);

        if (user) {
          const customer = await upsertCustomer(
            user.id,
            user.email,
            user.customerID || ''
          );

          if (customer) {
            await upsertSetupIntent(user.id, customer.id);
            return updateUser(user.id, { customerID: customer.id });
          }
        }

        console.error('Unable to create customer');
        return user;
      },
    });
  },
});

export const UserTokenQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('UserTokens', {
      type: 'UserToken',
      resolve: async (_, __, ctx) => {
        if (!ctx.user.uid) {
          throw new GqlUnauthorizedError('Not authorised');
        }

        const tokens = await ctx.db.userToken.findMany({
          where: {
            userID: ctx.user.uid,
          },
        });

        return tokens.map((token: any) => ({
          id: token.id,
          userID: token.userID,
          displayName: token.displayName,
          createdAt: token.createdAt,
          expiresAt: token.expiresAt,
        }));
      },
    });
  },
});
