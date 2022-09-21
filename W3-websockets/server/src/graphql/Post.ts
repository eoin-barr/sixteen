import { extendType, nonNull, objectType, stringArg } from "nexus";
import { PubSub } from "graphql-subscriptions";

type Event<T> = {
  data: T;
};

const pubsub = new PubSub();
export const Post = objectType({
  name: "Post", // <- Name of your type
  definition(t) {
    t.int("id"); // <- Field named `id` of type `Int`
    t.string("title"); // <- Field named `title` of type `String`
    t.boolean("published"); // <- Field named `published` of type `Boolean`
  },
});

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createPost", {
      type: "Post",
      args: {
        title: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        const postData = {
          title: args.title,
          published: true,
        };

        await pubsub.publish("POST_CREATED", postData);

        const post = await ctx.db.post.create({
          data: postData,
        });

        return post;
      },
    });
  },
});

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("posts", {
      type: "Post",
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({
          where: { published: true },
        });
      },
    });
  },
});

export const PostSubscription = extendType({
  type: "Subscription",
  definition(t) {
    t.nonNull.field("postCreated", {
      type: "Post",
      subscribe(_root, _args, ctx) {
        return ctx.pubsub.asyncIterator("POST_CREATED");
      },
      async resolve(eventPromise: Promise<Event<typeof Post>>) {
        const event = await eventPromise;
        console.log("event", event);
        return event.data;
      },
    });
  },
});
