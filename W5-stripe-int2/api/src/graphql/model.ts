import { objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('email');
    t.string('stripeId');
    t.nonNull.string('type');
    t.nonNull.string('password');
  },
});
