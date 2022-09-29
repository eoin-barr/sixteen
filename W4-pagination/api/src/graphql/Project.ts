import { extendType, objectType, nonNull, stringArg, intArg } from "nexus";
import { Context } from "../context";

export const Project = objectType({
  name: "Project",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("image");
  },
});

export const Edge = objectType({
  name: "Edge",
  definition(t) {
    t.string("cursor");
    t.field("node", {
      type: Project,
    });
  },
});

export const PageInfo = objectType({
  name: "PageInfo",
  definition(t) {
    t.string("endCursor");
    t.boolean("hasNextPage");
  },
});

export const Response = objectType({
  name: "Response",
  definition(t) {
    t.field("pageInfo", { type: PageInfo });
    t.list.field("edges", {
      type: Edge,
    });
  },
});

export const ProjectQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("project", {
      type: "Project",
      args: {
        projectId: nonNull(intArg()),
      },
      //@ts-ignore
      resolve: async (_parent, args, ctx) => {
        const projects = await ctx.db.project.findUnique({
          where: { id: args.projectId },
        });
        return projects;
      },
    });

    t.field("projects", {
      type: "Response",
      args: {
        first: intArg(),
        after: intArg(),
      },
      //@ts-ignore
      async resolve(_, args, ctx) {
        let queryResults = null;
        if (args.after) {
          queryResults = await ctx.db.project.findMany({
            //@ts-ignore
            take: args.first,
            skip: 1,
            cursor: {
              id: args.after,
            },
          });
        } else {
          queryResults = await ctx.db.project.findMany({
            //@ts-ignore
            take: args.first,
          });
        }
        if (queryResults.length > 0) {
          const lastProjectInResults = queryResults[queryResults.length - 1];
          const myCursor = lastProjectInResults.id;
          const secondQueryResults = await ctx.db.project.findMany({
            //@ts-ignore
            take: args.first,
            cursor: {
              id: myCursor,
            },
          });
          const result = {
            pageInfo: {
              endCursor: myCursor,
              //@ts-ignore
              hasNextPage: secondQueryResults.length >= args.first,
            },
            edges: queryResults.map((project: any) => ({
              cursor: project.id,
              node: project,
            })),
          };
          return result;
        }
      },
    });
  },
});

export const ProjectMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createProject", {
      type: "Project",
      args: {
        name: nonNull(stringArg()),
        image: nonNull(stringArg()),
      },
      resolve(_parent, args, ctx) {
        const createdProject = {
          name: args.name,
          image: args.image,
        };
        return ctx.db.project.create({ data: createdProject });
      },
    });

    t.field("deleteProject", {
      type: "Project",
      args: {
        projectId: nonNull(intArg()),
      },
      async resolve(_, args, ctx) {
        const project = await ctx.db.project.delete({
          where: { id: args.projectId },
        });
        return project;
      },
    });
  },
});
