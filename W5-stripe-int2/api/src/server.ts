import cors from 'cors';
import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './schema';
import { context } from './context';
import bodyParser from 'body-parser';

async function createServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    context,
  });

  const corsOptions = {
    origin: [
      /^http:\/\/localhost(:[0-9]+)/,
      'http://127.0.0.1:3000',
      /\.vercel\.app$/,
      'https://studio.apollographql.com',
    ],
    credentials: true,
    cors: false,
  };

  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  await server
    .start()
    .then(() => {
      server.applyMiddleware({ app, path: '/graphql', cors: corsOptions });
    })
    .catch((e) => {
      console.log(e);
      throw e;
    });
  return httpServer;
}

export { createServer };
