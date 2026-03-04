// ==========================================
// Authentication Mutations
// ==========================================

/**
 * Login mutation for WPGraphQL JWT Authentication
 * Requires: WPGraphQL JWT Authentication plugin
 */
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      user {
        id
        name
        email
        username
      }
    }
  }
`;

/**
 * Refresh auth token using refresh token
 */
export const REFRESH_AUTH_TOKEN = gql`
  mutation RefreshAuthToken($refreshToken: String!) {
    refreshJwtAuthToken(input: { jwtRefreshToken: $refreshToken }) {
      authToken
    }
  }
`;

// ==========================================
// Animal Mutations
// ==========================================

import { gql } from '@apollo/client';

/**
 * Create a new animal
 * Note: WordPress requires authentication for mutations
 */
export const CREATE_ANIMAL = gql`
  mutation CreateAnimal(
    $title: String!
    $content: String
    $excerpt: String
    $status: PostStatusEnum
    $animalTypes: AnimalAnimalTypesInput
    $animalStatuses: AnimalAnimalStatusesInput
    $age: String
    $breed: String
    $gender: String
    $weight: String
    $personality: String
    $medicalHistory: String
    $hashtags: String
  ) {
    createAnimal(
      input: {
        title: $title
        content: $content
        excerpt: $excerpt
        status: $status
        animalTypes: $animalTypes
        animalStatuses: $animalStatuses
        age: $age
        breed: $breed
        gender: $gender
        weight: $weight
        personality: $personality
        medicalHistory: $medicalHistory
        hashtags: $hashtags
      }
    ) {
      animal {
        databaseId
        title
        slug
        excerpt
        content
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
          weight
          personality
          medicalHistory
          hashtags
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

/**
 * Update an existing animal
 */
export const UPDATE_ANIMAL = gql`
  mutation UpdateAnimal(
    $id: ID!
    $title: String
    $content: String
    $excerpt: String
    $status: PostStatusEnum
    $animalTypes: AnimalAnimalTypesInput
    $animalStatuses: AnimalAnimalStatusesInput
    $age: String
    $breed: String
    $gender: String
    $weight: String
    $personality: String
    $medicalHistory: String
    $hashtags: String
  ) {
    updateAnimal(
      input: {
        id: $id
        title: $title
        content: $content
        excerpt: $excerpt
        status: $status
        animalTypes: $animalTypes
        animalStatuses: $animalStatuses
        age: $age
        breed: $breed
        gender: $gender
        weight: $weight
        personality: $personality
        medicalHistory: $medicalHistory
        hashtags: $hashtags
      }
    ) {
      animal {
        databaseId
        title
        slug
        excerpt
        content
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
          weight
          personality
          medicalHistory
          hashtags
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

/**
 * Delete an animal
 */
export const DELETE_ANIMAL = gql`
  mutation DeleteAnimal($id: ID!) {
    deleteAnimal(input: { id: $id }) {
      deletedId
    }
  }
`;

// ==========================================
// Input Types for Mutations
// ==========================================

export interface AnimalTermNodeInput {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
}

export interface AnimalTermsInput {
  append?: boolean;
  nodes?: AnimalTermNodeInput[];
}

/**
 * Variables for CREATE_ANIMAL mutation
 */
export interface CreateAnimalVariables {
  title: string;
  content?: string;
  excerpt?: string;
  status?: 'PUBLISH' | 'DRAFT' | 'PENDING';
  animalTypes?: AnimalTermsInput;
  animalStatuses?: AnimalTermsInput;
  age?: string;
  breed?: string;
  gender?: string;
  weight?: string;
  personality?: string;
  medicalHistory?: string;
  hashtags?: string;
}

/**
 * Variables for UPDATE_ANIMAL mutation
 */
export interface UpdateAnimalVariables {
  id: string;
  title?: string;
  content?: string;
  excerpt?: string;
  status?: 'PUBLISH' | 'DRAFT' | 'PENDING';
  animalTypes?: AnimalTermsInput;
  animalStatuses?: AnimalTermsInput;
  age?: string;
  breed?: string;
  gender?: string;
  weight?: string;
  personality?: string;
  medicalHistory?: string;
  hashtags?: string;
}

/**
 * Variables for DELETE_ANIMAL mutation
 */
export interface DeleteAnimalVariables {
  id: string;
}

/**
 * Response types
 */
export interface CreateAnimalData {
  createAnimal: {
    animal: {
      databaseId: number;
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      date: string;
      featuredImage?: {
        node: {
          sourceUrl: string;
        };
      };
      animalTypes?: {
        nodes: {
          name: string;
          slug: string;
        }[];
      };
      animalStatuses?: {
        nodes: {
          name: string;
          slug: string;
        }[];
      };
      animalFields?: {
        age?: string;
        breed?: string;
        gender?: string;
        weight?: string;
        personality?: string;
        medicalHistory?: string;
        hashtags?: string;
        image?: {
          node: {
            sourceUrl: string;
          };
        };
      };
    };
  };
}

export interface UpdateAnimalData {
  updateAnimal: {
    animal: {
      databaseId: number;
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      date: string;
      featuredImage?: {
        node: {
          sourceUrl: string;
        };
      };
      animalTypes?: {
        nodes: {
          name: string;
          slug: string;
        }[];
      };
      animalStatuses?: {
        nodes: {
          name: string;
          slug: string;
        }[];
      };
      animalFields?: {
        age?: string;
        breed?: string;
        gender?: string;
        weight?: string;
        personality?: string;
        medicalHistory?: string;
        hashtags?: string;
        image?: {
          node: {
            sourceUrl: string;
          };
        };
      };
    };
  };
}

export interface DeleteAnimalData {
  deleteAnimal: {
    deletedId: string;
  };
}

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity(
    $title: String!
    $content: String
    $excerpt: String
    $status: PostStatusEnum
    $featuredImageId: ID
    $activityFields: ActivityFieldsInput
    $projectCategories: [ID]
  ) {
    createProject(
      input: {
        title: $title
        content: $content
        excerpt: $excerpt
        status: $status
        featuredImageId: $featuredImageId
        activityFields: $activityFields
        projectCategories: $projectCategories
      }
    ) {
      project {
        databaseId
        slug
      }
    }
  }
`;

export const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity(
    $id: ID!
    $title: String
    $content: String
    $excerpt: String
    $status: PostStatusEnum
    $featuredImageId: ID
    $activityFields: ActivityFieldsInput
    $projectCategories: [ID]
  ) {
    updateProject(
      input: {
        id: $id
        title: $title
        content: $content
        excerpt: $excerpt
        status: $status
        featuredImageId: $featuredImageId
        activityFields: $activityFields
        projectCategories: $projectCategories
      }
    ) {
      project {
        databaseId
        slug
      }
    }
  }
`;

export const DELETE_ACTIVITY = gql`
  mutation DeleteActivity($id: ID!) {
    deleteProject(input: { id: $id }) {
      deletedId
    }
  }
`;

export interface ActivityFieldsInput {
  type?: string;
  impactSummary?: string;
  pintoimpact?: boolean;
}

export interface CreateActivityVariables {
  title: string;
  content?: string;
  excerpt?: string;
  status?: 'PUBLISH' | 'DRAFT' | 'PENDING';
  featuredImageId?: string;
  activityFields?: ActivityFieldsInput;
  projectCategories?: string[];
}

export interface UpdateActivityVariables extends CreateActivityVariables {
  id: string;
}

export interface DeleteActivityVariables {
  id: string;
}

export interface CreateActivityData {
  createProject: {
    project: {
      databaseId: number;
      slug: string;
    };
  };
}

export interface UpdateActivityData {
  updateProject: {
    project: {
      databaseId: number;
      slug: string;
    };
  };
}

export interface DeleteActivityData {
  deleteProject: {
    deletedId: string;
  };
}

export const CREATE_REVIEW = gql`
  mutation CreateReview(
    $title: String!
    $content: String
    $excerpt: String
    $status: PostStatusEnum
    $featuredImageId: ID
    $reviewFields: ReviewFieldsInput
  ) {
    createReview(
      input: {
        title: $title
        content: $content
        excerpt: $excerpt
        status: $status
        featuredImageId: $featuredImageId
        reviewFields: $reviewFields
      }
    ) {
      review {
        databaseId
        slug
      }
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview(
    $id: ID!
    $title: String
    $content: String
    $excerpt: String
    $status: PostStatusEnum
    $featuredImageId: ID
    $reviewFields: ReviewFieldsInput
  ) {
    updateReview(
      input: {
        id: $id
        title: $title
        content: $content
        excerpt: $excerpt
        status: $status
        featuredImageId: $featuredImageId
        reviewFields: $reviewFields
      }
    ) {
      review {
        databaseId
        slug
      }
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(input: { id: $id }) {
      deletedId
    }
  }
`;

export interface ReviewFieldsInput {
  authorName?: string;
  animalName?: string;
  animalType?: string;
  adoptionDate?: string;
  quote?: string;
  isPinned?: boolean;
}

export interface CreateReviewVariables {
  title: string;
  content?: string;
  excerpt?: string;
  status?: 'PUBLISH' | 'DRAFT' | 'PENDING';
  featuredImageId?: string;
  reviewFields?: ReviewFieldsInput;
}

export interface UpdateReviewVariables extends CreateReviewVariables {
  id: string;
}

export interface DeleteReviewVariables {
  id: string;
}

export interface CreateReviewData {
  createReview: {
    review: {
      databaseId: number;
      slug: string;
    };
  };
}

export interface UpdateReviewData {
  updateReview: {
    review: {
      databaseId: number;
      slug: string;
    };
  };
}

export interface DeleteReviewData {
  deleteReview: {
    deletedId: string;
  };
}

export const CREATE_SUPPORT_POST = gql`
  mutation CreateSupportPost(
    $title: String!
    $content: String
    $status: PostStatusEnum
    $supportMeta: SupportMetaInput
    $supportCategories: [ID]
  ) {
    createSupportPost(
      input: {
        title: $title
        content: $content
        status: $status
        supportMeta: $supportMeta
        supportCategories: $supportCategories
      }
    ) {
      supportPost {
        databaseId
        slug
      }
    }
  }
`;

export const UPDATE_SUPPORT_POST = gql`
  mutation UpdateSupportPost(
    $id: ID!
    $title: String
    $content: String
    $status: PostStatusEnum
    $supportMeta: SupportMetaInput
    $supportCategories: [ID]
  ) {
    updateSupportPost(
      input: {
        id: $id
        title: $title
        content: $content
        status: $status
        supportMeta: $supportMeta
        supportCategories: $supportCategories
      }
    ) {
      supportPost {
        databaseId
        slug
      }
    }
  }
`;

export const DELETE_SUPPORT_POST = gql`
  mutation DeleteSupportPost($id: ID!) {
    deleteSupportPost(input: { id: $id }) {
      deletedId
    }
  }
`;

export interface SupportMetaInput {
  isNotice?: boolean;
  viewCount?: number;
  attachedFile?: string;
}

export interface CreateSupportPostVariables {
  title: string;
  content?: string;
  status?: 'PUBLISH' | 'DRAFT' | 'PENDING';
  supportMeta?: SupportMetaInput;
  supportCategories?: string[];
}

export interface UpdateSupportPostVariables extends CreateSupportPostVariables {
  id: string;
}

export interface DeleteSupportPostVariables {
  id: string;
}

export interface CreateSupportPostData {
  createSupportPost: {
    supportPost: {
      databaseId: number;
      slug: string;
    };
  };
}

export interface UpdateSupportPostData {
  updateSupportPost: {
    supportPost: {
      databaseId: number;
      slug: string;
    };
  };
}

export interface DeleteSupportPostData {
  deleteSupportPost: {
    deletedId: string;
  };
}

// ==========================================
// Authentication Types
// ==========================================

export interface UserData {
  id: string;
  name: string;
  email: string;
  username: string;
}

export interface LoginData {
  login: {
    authToken: string;
    refreshToken: string;
    user: UserData;
  };
}

export interface LoginVariables {
  username: string;
  password: string;
}

export interface RefreshAuthTokenData {
  refreshJwtAuthToken: {
    authToken: string;
  };
}

export interface RefreshAuthTokenVariables {
  refreshToken: string;
}
