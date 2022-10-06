import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css';
import { client } from '../lib/apollo';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
