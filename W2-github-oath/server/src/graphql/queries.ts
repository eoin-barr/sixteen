import { extendType, nonNull, stringArg } from "nexus";
import { getUser } from "../db";
import { GqlUnauthorizedError } from "../lib/errors/gql";
import { uuidArg } from "./scalars";

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("me", {
      type: "User",
      async resolve(_, __, ctx) {
        if (!ctx.user.uid) {
          throw new GqlUnauthorizedError("Not authenticated");
        }

        const user = await getUser(ctx.user.uid);
        if (!user) {
          throw new GqlUnauthorizedError("User not found");
        }

        return user;
      },
    });
  },
});

export const UserTokenQurey = extendType({
  type: "Query",
  definition(t) {
    t.list.field("UserTokens", {
      type: "UserToken",
      resolve: async (_, __, ctx) => {
        if (!ctx.user.uid) {
          throw new GqlUnauthorizedError("Not authorised");
        }

        const tokens = await ctx.db.userToken.findMany({
          where: {
            userID: ctx.user.uid,
          },
        });

        return tokens.map((token: any) => ({
          id: token.id,
          userID: token.userID,
          displayName: token.displayName,
          createdAt: token.createdAt,
          expiresAt: token.expiresAt,
        }));
      },
    });
  },
});
