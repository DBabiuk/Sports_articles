import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

function getGraphqlUrl() {
  if (typeof window === 'undefined') {
    return (
      process.env.GRAPHQL_SSR_URL ||
      process.env.NEXT_PUBLIC_GRAPHQL_URL ||
      'http://localhost:4000/graphql'
    );
  }
  return process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
}

export function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({ uri: getGraphqlUrl() }),
    cache: new InMemoryCache(),
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
