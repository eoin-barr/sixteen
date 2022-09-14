import { extendType, nonNull, stringArg } from "nexus";

import { bigIntArg } from "../scalars";
import { GqlUnauthorizedError } from "../../lib/errors/gql";
import { upsertUser } from "../../db";

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("upsertMe", {
      type: "User",
      args: {
        email: nonNull(stringArg()),
        githubID: nonNull(bigIntArg()),
        githubAvatarUrl: nonNull(stringArg()),
        githubUsername: nonNull(stringArg()),
      },

      async resolve(_root, args, ctx) {
        if (!ctx.user.id) {
          throw new GqlUnauthorizedError("Not authenticated");
        }

        let user = await upsertUser({
          email: args.email,
          githubID: args.githubID,
          githubUsername: args.githubUsername,
          githubAvatarUrl: args.githubAvatarUrl,
        });

        return user;
      },
    });
  },
});
