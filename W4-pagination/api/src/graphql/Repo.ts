import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";

export const Repo = objectType({
  name: "Repo",
  definition(t) {
    t.int("id");
    t.string("title");
  },
});

export const RepoSummary = objectType({
  name: "RepoSummary",
  definition(t) {
    t.list.field("repos", { type: "Repo" });
    t.int("count");
  },
});

export const RepoQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("repos", {
      type: "Repo",
      args: {
        offset: nonNull(intArg()),
        limit: nonNull(intArg()),
      },
      async resolve(parent, args, ctx) {
        const repos = await ctx.db.repo.findMany();
        return repos.slice(args.offset, args.offset + args.limit);
      },
    });

    t.field("repoSummary", {
      type: RepoSummary,
      args: {
        offset: nonNull(intArg()),
        limit: nonNull(intArg()),
      },
      async resolve(parent, args, ctx) {
        const repos = await ctx.db.repo.findMany();
        return {
          repos: repos.slice(args.offset, args.offset + args.limit),
          count: repos.length,
        };
      },
    });
  },
});

export const RepoMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createRepo", {
      type: "Repo",
      args: {
        title: nonNull(stringArg()),
      },
      resolve(_, args, ctx) {
        return ctx.db.repo
          .create({
            data: {
              title: args.title,
            },
          })
          .then((repo: any) => {
            return repo;
          })
          .catch((err: any) => {
            console.log("Error: ", err);
          });
      },
    });
  },
});
