import '../styles/globals.css';
import type { AppProps } from 'next/app';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
