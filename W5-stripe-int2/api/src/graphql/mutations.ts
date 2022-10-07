import { extendType, nonNull, stringArg } from 'nexus';
import bcrypt from 'bcryptjs';
import { GqlInternalServerError } from '../lib/errors';

export const UserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('register', {
      type: 'User',
      args: {
        name: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const hashedPassword = await bcrypt.hash(args.password, 10);
        const user = await ctx.db.user.create({
          data: {
            name: args.name,
            password: hashedPassword,
          },
        });

        if (!user) {
          throw new GqlInternalServerError('Failed to create user');
        }
        return user;
      },
    });
  },
});
