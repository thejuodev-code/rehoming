import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export const client = new ApolloClient({
    link: new HttpLink({
        uri: API_URL,
    }),
    cache: new InMemoryCache(),
});
