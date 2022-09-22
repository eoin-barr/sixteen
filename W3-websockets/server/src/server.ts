import { schema } from "./schema";
import { context } from "./context";
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const http = require("http");
const cors = require("cors");

const PORT = 4000;
const app = express();
app.use(cors());
export const server = new ApolloServer({
  schema,
  context,
});
server.applyMiddleware({ app });
export const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
