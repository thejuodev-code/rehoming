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

export const GET_ANIMALS = gql`
  query GetAnimals($first: Int = 100) {
    animals(first: $first) {
      nodes {
        databaseId
        title
        excerpt
        content
        slug
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        animalTypes {
          nodes {
            name
            slug
          }
        }
        animalStatuses {
          nodes {
            name
            slug
          }
        }
        animalFields {
          age
          breed
          gender
          hashtags
          weight
          rescueDate
          rescueLocation
          personality
          medicalHistory
          image {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
`;

export const GET_ANIMAL_BY_SLUG = gql`
  query GetAnimalBySlug($id: ID!) {
    animal(id: $id, idType: SLUG) {
      databaseId
      title
      excerpt
      content
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      animalTypes {
        nodes {
          name
          slug
        }
      }
      animalStatuses {
        nodes {
          name
          slug
        }
      }
      animalFields {
        age
        breed
        gender
        hashtags
        weight
        rescueDate
        rescueLocation
        personality
        medicalHistory
        image {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

// ==========================================
// Reviews (입양 후기)
// ==========================================
export const GET_REVIEWS = gql`
  query GetReviews($first: Int = 50) {
    reviews(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        databaseId
        title
        excerpt
        content
        slug
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        reviewFields {
          authorName
          animalName
          animalType
          adoptionDate
          quote
          isPinned
        }
      }
    }
  }
`;

export const GET_REVIEW_BY_SLUG = gql`
  query GetReviewBySlug($id: [ID]) {
    reviews(where: { in: $id }, first: 1) {
      nodes {
        databaseId
        title
        excerpt
        content
        slug
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        reviewFields {
          authorName
          animalName
          animalType
          adoptionDate
          quote
          isPinned
        }
      }
    }
  }
`;

// ==========================================
// Support Board (후원/봉사 게시판)
// ==========================================
export const GET_SUPPORT_POSTS = gql`
  query GetSupportPosts($first: Int = 50) {
    supportPosts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
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
          attachedFile {
            node {
              sourceUrl
              mediaItemUrl
              mimeType
              title
            }
          }
        }
      }
    }
  }
`;

export const GET_SUPPORT_POST_BY_SLUG = gql`
  query GetSupportPostBySlug($id: ID!) {
    supportPost(id: $id, idType: SLUG) {
      databaseId
      title
      content
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
        attachedFile {
          node {
            sourceUrl
            mediaItemUrl
            mimeType
            title
            fileSize
          }
        }
      }
    }
  }
`;
