import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!API_URL) {
    console.warn("Warning: NEXT_PUBLIC_WORDPRESS_API_URL is not defined. GraphQL requests will fail.");
}

export const client = new ApolloClient({
    link: new HttpLink({
        uri: API_URL,
    }),
    cache: new InMemoryCache(),
});
