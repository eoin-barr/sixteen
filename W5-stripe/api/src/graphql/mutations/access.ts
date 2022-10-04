import { extendType, nonNull, stringArg } from 'nexus';
import { createSecureToken } from '../../lib/auth/token';
import { GqlUnauthorizedError } from '../../lib/errors';
import { dateTimeArg, uuidArg } from '../scalars';

export const UserTokenMutatioon = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createUserToken', {
      type: 'UserToken',
      args: {
        expiresAt: dateTimeArg(),
      },
      resolve: (_root, args, ctx) => {
        if (!ctx.user.uid) {
          throw new GqlUnauthorizedError('Not authenticated');
        }

        const st = createSecureToken(args.expiresAt);
        return ctx.db.userToken
          .create({
            data: {
              hash: st.hash,
              userID: ctx.user.uid,
              displayName: st.displayName,
              expiresAt: st.expiresAt,
            },
          })
          .then((res: any) => ({
            id: res.id,
            userID: res.userID,
            token: st.token,
            displayName: st.displayName,
            createdAt: res.createdAt,
            expiresAt: res.expiresAt,
          }));
      },
    });

    t.field('deleteUserToken', {
      type: 'UserToken',
      args: {
        id: nonNull(uuidArg()),
      },
      resolve: (_root, args, ctx) => {
        if (!ctx.user.uid) {
          throw new GqlUnauthorizedError('Not authenticated');
        }

        return ctx.db.userToken.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});
