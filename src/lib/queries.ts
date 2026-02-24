import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($first: Int = 10) {
    posts(first: $first) {
      nodes {
        id
        title
        excerpt
        date
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            slug
            name
          }
        }
      }
    }
  }
`;

export const GET_PAGES = gql`
  query GetPages {
    pages {
      nodes {
        id
        title
        slug
        content
      }
    }
  }
`;

export const GET_ACTIVITIES = gql`
  query GetActivities {
    projects(first: 100) {
      nodes {
        databaseId
        title
        excerpt
        content
        date
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        projectCategories {
          nodes {
            name
            slug
          }
        }
        activityFields {
          type
          impactSummary
          pintoimpact
        }
      }
    }
  }
`;

export const GET_ACTIVITY_BY_SLUG = gql`
  query GetActivityBySlug($slug: String!) {
    projects(where: { name: $slug }, first: 1) {
      nodes {
        databaseId
        title
        content
        excerpt
        date
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        projectCategories {
          nodes {
            name
            slug
          }
        }
        activityFields {
          type
          impactSummary
          pintoimpact
        }
      }
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects($first: Int = 100) {
    projects(first: $first) {
      nodes {
        databaseId
        title
        content
        slug
        projectCategories {
          nodes {
            name
            slug
          }
        }
        activityFields {
          type
          impactSummary
          pintoimpact
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;
