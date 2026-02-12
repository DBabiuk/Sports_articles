import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

export function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({ uri: GRAPHQL_URL }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: { fetchPolicy: 'no-cache' },
    },
  });
}

let clientSideApolloClient: ApolloClient<unknown> | null = null;

export function getApolloClient() {
  if (typeof window === 'undefined') {
    return createApolloClient();
  }

  if (!clientSideApolloClient) {
    clientSideApolloClient = createApolloClient();
  }

  return clientSideApolloClient;
}
