import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { split, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { AUTH_TOKEN } from '../constants';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const wsLink2 = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
    // connectionParams: {
    //   authToken: user.authToken,
    // },
  })
);

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  // options: {
  //   reconnect: true,
  //   connectionParams: {
  //     authToken: localStorage.getItem(AUTH_TOKEN),
  //   },
  // },
});

const link = split(
  ({ query }) => {
    //@ts-ignore
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
