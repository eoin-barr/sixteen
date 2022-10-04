import { FieldResolver } from 'nexus';
import { db } from '../../db';
import { GqlUnauthorizedError } from '../../lib/errors';
import { githubOauthTokenIsValid } from '../../lib/github';

export function getUserName(id: bigint) {
  return db.user.findUnique({ where: { id: id } }).then((user: any) => {
    if (!user) {
      throw new Error('User not found');
    }
    return user.githubUsername;
  });
}

export const resolveGithubAppAuthorized: FieldResolver<
  'User',
  'githubAppAuthorized'
> = async (parent, _, ctx) => {
  if (!ctx.user.uid) {
    throw new GqlUnauthorizedError('Not authenticated');
  }
  return githubOauthTokenIsValid(ctx.user.uid);
};
