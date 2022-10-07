import { extendType, nonNull, stringArg } from 'nexus';
import bcrypt from 'bcryptjs';
import { GqlInternalServerError, GqlUnauthorizedError } from '../lib/errors';
import { stripe } from '../stripe';

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
            stripeId: '',
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

    t.nonNull.field('createStripeSubscription', {
      type: 'User',
      args: {
        source: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        if (!ctx.req.session.userId) {
          throw new GqlUnauthorizedError('You must be logged in');
        }

        let user = await ctx.db.user.findUnique({
          where: {
            id: ctx.req.session.userId,
          },
        });

        if (!user) {
          throw new GqlUnauthorizedError('Could not find user');
        }

        const customer = await stripe.customers.create({
          email: user.email,
          source: args.source,
        });

        const charge = await stripe.charges.create({
          amount: 1000,
          currency: 'eur',
          customer: customer.id,
          description: 'Example charge',
        });

        user = await ctx.db.user.update({
          where: {
            id: user.id,
          },
          data: {
            stripeId: customer.id,
            type: 'paid',
          },
        });

        return user;
      },
    });
  },
});
