import { objectType } from "nexus";
import { resolveGithubAppAuthorized } from "./resolvers/user";
import { bigIntArg } from "./scalars";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.bigInt("id");
    t.nonNull.string("email");
    t.nonNull.int("githubID");
    t.nonNull.string("githubUsername");
    t.nonNull.string("githubAppAuthorized", {
      resolve: resolveGithubAppAuthorized,
    });
    t.nonNull.dateTime("dateJoined");
  },
});

export const UserToken = objectType({
  name: "UserToken",
  definition(t) {
    t.nonNull.uuid("id");
    t.string("hash");
    t.string("token");
    t.nonNull.string("displayName");
    t.nonNull.dateTime("expiresAt");
    t.nonNull.dateTime("createdAt");
  },
});

export const AuthCode = objectType({
  name: "AuthCode",
  definition(t) {
    t.nonNull.uuid("id");
    t.nonNull.string("code");
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("expiresAt");
  },
});

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.int("id");
    t.string("title");
    t.boolean("published");
  },
});
