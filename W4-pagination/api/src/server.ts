import { schema } from "./schema";
import { context } from "./context";
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const http = require("http");
const cors = require("cors");

const corsOptions = {
  origin: [
    /^http:\/\/localhost(:[0-9]+)/,
    "http://127.0.0.1:3000",
    "https://studio.apollographql.com",
  ],
  credentials: true,
  cors: false,
};

const app = express();
app.use(cors(corsOptions));
export const server = new ApolloServer({
  schema,
  context,
});
server.applyMiddleware({ app, path: "/graphql", cors: corsOptions });
export const httpServer = http.createServer(app);
