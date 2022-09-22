import {
  extendType,
  objectType,
  nonNull,
  stringArg,
  intArg,
  subscriptionField,
} from "nexus";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

type Event<T> = {
  data: T;
};

export const Message = objectType({
  name: "Message",
  definition(t) {
    t.int("id");
    t.string("text");
    t.int("userId");
  },
});

export const MessageSubscription = extendType({
  type: "Subscription",
  definition(t) {
    t.field("createMessage", {
      type: "Message",
      subscribe(_, __, ctx) {
        return ctx.pubsub.asyncIterator("createMessage");
      },
      //@ts-ignore
      async resolve(eventPromise: Promise<Event<typeof Message>>) {
        const event = await eventPromise;
        console.log(event);
        return event.data;
      },
    });
  },
});

export const MessageQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("message", {
      type: "Message",
      args: {
        messageId: nonNull(intArg()),
      },
      //@ts-ignore
      resolve: async (_parent, args, ctx) => {
        const messages = await ctx.db.message.findUnique({
          where: { id: args.messageId },
        });
        return messages;
      },
    });

    t.nonNull.list.field("messages", {
      type: "Message",
      resolve: async (_parent, __args, ctx) => {
        const messages = ctx.db.message.findMany({
          select: { id: true, text: true, userId: true },
        });
        return messages;
      },
    });

    t.nonNull.list.field("userMessages", {
      type: "Message",
      args: {
        userId: nonNull(intArg()),
      },
      async resolve(_, args, ctx) {
        const messages: any = await ctx.db.message.findMany({
          select: { id: true, text: true, userId: true },
        });

        return messages;
      },
    });
  },
});

export const MessageMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createMessage", {
      type: "Message",
      args: {
        text: nonNull(stringArg()),
        userId: nonNull(intArg()),
      },
      async resolve(_parent, args, ctx) {
        const createdMessage = {
          text: args.text,
          userId: args.userId,
        };

        const m = await ctx.db.message.create({ data: createdMessage });
        await ctx.pubsub.publish("createMessage", {
          data: m,
        });

        return m;
      },
    });

    t.field("deleteMessage", {
      type: "Message",
      args: {
        messageId: nonNull(intArg()),
      },
      async resolve(_, args, ctx) {
        const message = await ctx.db.message.delete({
          where: { id: args.messageId },
        });
        return message;
      },
    });
  },
});
