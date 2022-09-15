import http from "http";
import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";
import bodyParser from "body-parser";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import { UserContext } from "./lib/types";
import { authenticateBearerToken } from "./lib/auth/bearer";
import { authenticateCookie, getCookieFromRequest } from "./lib/auth/cookie";

import router from "./routes";
import { schema } from "./schema";
import { request as requestMiddleware } from "./middleware";
import { auth, BEARER_CREDENTIALS_REGEXP } from "./lib/auth";
import { context } from "./context";
import { CheckDbConnectionPlugin } from "./db";
import { GqlUnauthorizedError } from "./lib/errors/gql";

async function createServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({ server: httpServer });
  const serverCleanup = useServer(
    {
      schema,
      onConnect: async (ctx) => {
        // @ts-ignore - attach no-op onDisconnect handler that can be overwritten by a
        // context consumer to handler disconnection
        ctx.extra.onDisconnect = () => {};
      },
      onDisconnect: async (ctx) => {
        //@ts-ignore
        ctx.extra.onDisconnect();
      },
      context: async (ctx, _, __) => {
        let user: UserContext;
        const headers = ctx.extra.request.headers;

        let token = getCookieFromRequest(headers);
        if (token) {
          user = await authenticateCookie(token);
          return { ...context, user, extra: ctx.extra };
        }

        if (!ctx.connectionParams) {
          throw new GqlUnauthorizedError("No authorization header found");
        }

        const connParams = Object.fromEntries(
          Object.entries(ctx.connectionParams).map(([key, value]) => [
            key.toLowerCase(),
            value,
          ])
        );

        if (!connParams.authorization) {
          throw new GqlUnauthorizedError("No authorization header found");
        }

        const authHeader = connParams.authorization as string;
        if (!BEARER_CREDENTIALS_REGEXP.exec(authHeader)) {
          throw new GqlUnauthorizedError("Bearer token missing");
        }

        token = authHeader.split(" ")[1];
        return authenticateBearerToken(token).then((user) => ({
          ...context,
          user: user,
          extra: ctx.extra,
        }));
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    context: async ({ req }) =>
      auth(req.headers)
        .then((u) => ({ ...context, user: u }))
        .catch((e) => {
          if (e instanceof GqlUnauthorizedError) {
            return context;
          }
          throw e;
        }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      CheckDbConnectionPlugin({ db: context.db }),
    ],
  });

  const corsOptions = {
    origin: [
      /^http:\/\/localhost(:[0-9]+)/,
      "http://127.0.0.1:3000",
      /\.vercel\.app$/,
      "https://studio.apollographql.com",
    ],
    credentials: true,
    cors: false,
  };

  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(router);

  await server
    .start()
    .then(() => {
      app.use(requestMiddleware);
      server.applyMiddleware({ app, path: "graphql", cors: corsOptions });
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return httpServer;
}

export { createServer };
