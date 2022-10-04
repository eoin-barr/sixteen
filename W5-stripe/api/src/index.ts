import { createServer } from './server';

(async (resolve) => {
  const httpServer = await createServer();
  return httpServer.listen({ port: 4000 }, resolve);
})().then(() => {
  console.log('API server is running on http://localhost:4000/ 🚀');
  console.log('Apollo GraphQL server is running on http://localhost:4000/graphql 🚀');
});
