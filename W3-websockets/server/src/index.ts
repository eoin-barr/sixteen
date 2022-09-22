import { server, httpServer } from "./server";

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });
const PORT = 4000;

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
