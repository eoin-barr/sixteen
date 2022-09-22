import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css';

import {
  split,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import { GRAPHQL_ENDPOINT } from '../lib/constants';

const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'same-origin',
});

const wssLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
  },
  // eslint-disable-next-line global-require
  webSocketImpl: require('websocket').w3cwebsocket,
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wssLink,
      httpLink
    ),
    cache: new InMemoryCache(),
  });
}

const client = createApolloClient();

function MyApp({ Component }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component />
    </ApolloProvider>
  );
}

export default MyApp;
