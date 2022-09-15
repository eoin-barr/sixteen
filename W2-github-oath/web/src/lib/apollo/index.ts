import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { HttpLink, ApolloLink, ApolloClient, InMemoryCache, split } from '@apollo/client';

const GQL_ENDPOINT = 'http://localhost:4000/graphql';

const httpLink = new HttpLink({ uri: GQL_ENDPOINT, credentials: 'include' });

const namedLink = new ApolloLink((operation, forward) => {
  operation.setContext(() => ({
    uri: `${GQL_ENDPOINT}?${operation.operationName}`,
  }));
  return forward ? forward(operation) : null;
});

const chainedHttp = ApolloLink.from([namedLink, httpLink]);

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: GQL_ENDPOINT!.replace(/^http/, 'ws'),
        })
      )
    : null;

const splitLink =
  typeof window !== 'undefined' && wsLink !== null
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return def.kind === 'OperationDefinition' && def.operation === 'subscription';
        },
        wsLink,
        chainedHttp
      )
    : chainedHttp;

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  credentials: 'include',
});
