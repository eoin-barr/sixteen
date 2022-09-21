import http from "http";
import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";
import bodyParser from "body-parser";
import { useServer } from "graphql-ws/lib/use/ws";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import { schema } from "./schema";
import { context } from "./context";
import { CheckDbConnectionPlugin } from "./db";
export const server = new ApolloServer({ schema });

async function createServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({ server: httpServer });

  const serverCleanup = useServer({ schema, context }, wsServer);

  const server = new ApolloServer({
    schema,
    context,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      CheckDbConnectionPlugin({ db: context.db }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
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

  await server
    .start()
    .then(() => {
      server.applyMiddleware({ app, path: "/graphql", cors: corsOptions });
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });

  return httpServer;
}

export { createServer };
