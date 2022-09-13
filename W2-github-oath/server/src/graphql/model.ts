import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("email");
    t.nonNull.int("githubID");
    t.nonNull.string("githubUsername");
    t.nonNull.string("githubAppAuthorized");
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
