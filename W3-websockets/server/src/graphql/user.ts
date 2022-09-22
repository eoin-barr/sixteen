import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import { APP_SECRET } from "../utils";

export const User = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("email");
    t.string("password");
  },
});

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token");
    t.nonNull.field("user", {
      // @ts-ignore
      type: "User",
    });
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("user", {
      type: "User",
      args: {
        userId: nonNull(intArg()),
      },
      //@ts-ignore
      async resolve(_parent, args, ctx) {
        const user = await ctx.db.user.findFirst({
          where: { id: args.userId },
        });
        return user;
      },
    });

    t.nonNull.list.field("users", {
      type: "User",
      async resolve(_, __, ctx) {
        const users = await ctx.db.user.findMany({
          select: { id: true, name: true, email: true },
        });
        return users;
      },
    });
  },
});

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "AuthPayload",
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      //@ts-ignore
      async resolve(_parent, args, ctx) {
        const password = await bcrypt.hash(args.password, 10);

        const userInfo = {
          name: args.name,
          email: args.email,
          password: password,
        };
        const user = await ctx.db.user.create({ data: userInfo });
        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        return { token, user };
      },
    });

    // t.nonNull.field('login', {
    //   type: 'User',
    //   args: {
    //     email: nonNull(stringArg()),
    //     password: nonNull(stringArg())
    //   },
    //   //@ts-ignore
    //   async resolve(_parent, args, ctx) {
    //     const user = await ctx.db.user.findUnique({ where: { email: args.email } })
    //     if (!user) throw new Error('No user with this email')

    //     const valid = await bcrypt.compare(
    //       args.password,
    //       user.password
    //     )

    //     if (!valid) throw new Error('Invalid password')

    //     const token = jwt.sign({ userId: user.id }, APP_SECRET)

    //     return { token, user }
    //   }
    // })
  },
});

export const AuthPayloadMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("login", {
      //@ts-ignore
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        const user = await ctx.db.user.findUnique({
          where: { email: args.email },
        });
        if (!user) throw new Error("No user with this email");

        const valid = await bcrypt.compare(args.password, user.password);

        if (!valid) throw new Error("Invalid password");

        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        return { token, user };
      },
    });
  },
});
