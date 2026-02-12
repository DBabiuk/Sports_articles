import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { getApolloClient } from '@/lib/apollo';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const client = getApolloClient();

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
