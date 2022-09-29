import { HttpLink, ApolloLink, ApolloClient, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

const namedLink = new ApolloLink((operation, forward) => {
  operation.setContext(() => ({
    uri: `http://localhost:4000/graphql?${operation.operationName}`,
  }));
  return forward ? forward(operation) : null;
});

const chainedHttp = ApolloLink.from([namedLink, httpLink]);

export const client = new ApolloClient({
  link: chainedHttp,
  cache: new InMemoryCache(),
  credentials: 'include',
});
