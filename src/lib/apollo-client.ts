import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!API_URL) {
  console.warn("Warning: NEXT_PUBLIC_WORDPRESS_API_URL is not defined. GraphQL requests will fail.");
}

/**
 * Auth link - adds JWT token to requests
 */
const authLink = setContext((_, { headers, skipAuth }) => {
  const isPublicRoute =
    typeof window !== 'undefined' &&
    !window.location.pathname.startsWith('/admin');

  if (skipAuth || isPublicRoute) {
    return {
      headers: {
        ...headers,
        authorization: undefined,
      },
    };
  }

  // Get the authentication token from local storage if it exists
  const token = getAuthToken();
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    }
  };
});

/**
 * HTTP link - handles the actual network requests
 */
const httpLink = new HttpLink({
  uri: API_URL,
});

/**
 * Apollo Client instance
 * Chains auth link before HTTP link
 */
export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
