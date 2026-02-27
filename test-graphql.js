const fetch = require('node-fetch');

const query = `
  query GetSupportPosts {
    supportPosts(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        databaseId
        title
        slug
        date
        author {
          node {
            name
          }
        }
        supportCategories {
          nodes {
            name
            slug
          }
        }
        supportMeta {
          isNotice
          viewCount
        }
      }
    }
  }
`;

async function main() {
    const res = await fetch('https://lovejuo123.mycafe24.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });

    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
