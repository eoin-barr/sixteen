import { objectType } from 'nexus';
import { bigIntArg } from './scalars';
import { resolveGithubAppAuthorized } from './resolvers/user';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.bigInt('id');
    t.nonNull.string('email');
    t.nonNull.bigInt('githubID');
    t.nonNull.string('githubAvatarUrl');
    t.nonNull.string('githubUsername');
    t.nonNull.boolean('githubAppAuthorized', {
      resolve: resolveGithubAppAuthorized,
    });
    t.string('customerID');
    t.nonNull.dateTime('dateJoined');
  },
});

export const UserToken = objectType({
  name: 'UserToken',
  definition(t) {
    t.nonNull.uuid('id');
    t.string('hash');
    t.string('token');
    t.nonNull.string('displayName');
    t.nonNull.dateTime('expiresAt');
    t.nonNull.dateTime('createdAt');
  },
});

export const AuthCode = objectType({
  name: 'AuthCode',
  definition(t) {
    t.nonNull.uuid('id');
    t.nonNull.string('code');
    t.nonNull.dateTime('createdAt');
    t.nonNull.dateTime('expiresAt');
  },
});

export const Stripe = objectType({
  name: 'Stripe',
  definition(t) {
    t.string('clientSecretValue');
    t.string('clientCheckoutUrl');
    t.boolean('subscribed');
  },
});
