import { extendType } from 'nexus';
import { GqlUnauthorizedError } from '../lib/errors';

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      async resolve(_, __, ctx) {
        console.log('SES', ctx.req.session);
        if (!ctx.req.session.userId) {
          throw new GqlUnauthorizedError('Not authenticated');
        }
        const user = await ctx.db.user.findUnique({
          where: {
            id: ctx.req.session.userId,
          },
        });
        if (!user) {
          throw new GqlUnauthorizedError('Could not find user');
        }
        return user;
      },
    });
  },
});
