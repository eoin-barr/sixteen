import { extendType, nonNull, stringArg } from 'nexus';

import {
  createCheckoutSession,
  getSubscription,
  upsertSetupIntent,
} from '../../lib/stripe';
import { getUser } from '../../db';
import { GqlUnauthorizedError } from '../../lib/errors';

export const ClientSecretQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('clientSecret', {
      type: 'Stripe',
      async resolve(_, __, ctx) {
        if (!ctx.user.uid) {
          throw new GqlUnauthorizedError('Not authenticated');
        }

        const user = await getUser(ctx.user.uid);
        const result: { clientSecretValue: string | null } = { clientSecretValue: null };

        if (user && user.customerID) {
          const setupIntent = await upsertSetupIntent(ctx.user.uid, user.customerID);
          if (setupIntent) {
            result.clientSecretValue = setupIntent.client_secret;
          }
        }

        return result;
      },
    });
  },
});

export const ClientCheckoutQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('clientCheckout', {
      type: 'Stripe',
      args: {
        priceID: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        if (!ctx.user.uid) {
          throw new GqlUnauthorizedError('Not authenticated');
        }

        const user = await getUser(ctx.user.uid);
        const result = { clientCheckoutUrl: '/payment?error' };

        if (user && user.customerID) {
          const checkoutSession = await createCheckoutSession(
            ctx.user.uid,
            user.customerID,
            args.priceID
          );

          if (checkoutSession) {
            result.clientCheckoutUrl = checkoutSession.url!;
          }
        }
        return result;
      },
    });
  },
});

export const SubscriptionQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('subscription', {
      type: 'Stripe',
      async resolve(_, __, ctx) {
        if (!ctx.user.uid) {
          throw new GqlUnauthorizedError('Not authenticated');
        }

        const user = await getUser(ctx.user.uid);
        const result = { subscribed: false };

        if (user && user.customerID) {
          const subscription = await getSubscription(ctx.user.uid);
          if (subscription) {
            result.subscribed = true;
          }
        }

        return result;
      },
    });
  },
});
