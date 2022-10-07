import { extendType, nonNull, stringArg } from 'nexus';
import bcrypt from 'bcryptjs';
import { GqlInternalServerError, GqlUnauthorizedError } from '../lib/errors';

const setSession = (ctx: any, user: any) => {
  ctx.req.session.userId = user.id;
  return user;
};

export const UserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('register', {
      type: 'User',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const hashedPassword = await bcrypt.hash(args.password, 10);
        const user = await ctx.db.user.create({
          data: {
            email: args.email,
            password: hashedPassword,
          },
        });

        if (!user) {
          throw new GqlInternalServerError('Failed to create user');
        }
        return user;
      },
    });

    t.nonNull.field('login', {
      type: 'User',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const user = await ctx.db.user.findUnique({
          where: {
            email: args.email,
          },
        });

        if (!user) {
          throw new GqlUnauthorizedError('Could not find user with that email');
        }

        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new GqlUnauthorizedError('Incorrect password');
        }

        await setSession(ctx, user);

        return user;
      },
    });
  },
});
