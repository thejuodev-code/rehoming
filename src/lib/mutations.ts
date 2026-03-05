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
    $animalFields: AnimalFieldsInput
  ) {
    createAnimal(
      input: {
        title: $title
        content: $content
        excerpt: $excerpt
        status: $status
        animalTypes: $animalTypes
        animalStatuses: $animalStatuses
        animalFields: $animalFields
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
    $animalFields: AnimalFieldsInput
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
        animalFields: $animalFields
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

export interface AnimalFieldsInput {
  age?: string;
  breed?: string;
  gender?: string;
  weight?: string;
  personality?: string;
  medicalHistory?: string;
  hashtags?: string;
  image?: number; // image attachment ID
}

/**
 * Variables for CREATE_ANIMAL mutation
 */
export interface CreateAnimalVariables {
  title: string;
  content?: string;
  excerpt?: string;
  status?: 'PUBLISH' | 'DRAFT' | 'PENDING';
  featuredImageId?: number;
  animalTypes?: {
    nodes: Array<{ id: string }>;
  };
  animalStatuses?: {
    nodes: Array<{ id: string }>;
  };
  animalFields?: AnimalFieldsInput;
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
  featuredImageId?: number;
  animalTypes?: {
    nodes: Array<{ id: string }>;
  };
  animalStatuses?: {
    nodes: Array<{ id: string }>;
  };
  animalFields?: AnimalFieldsInput;
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
    $projectCategories: ProjectProjectCategoriesInput
  ) {
    createProject(
      input: {
        title: $title
        content: $content
        excerpt: $excerpt
        status: $status
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
    $projectCategories: ProjectProjectCategoriesInput
  ) {
    updateProject(
      input: {
        id: $id
        title: $title
        content: $content
        excerpt: $excerpt
        status: $status
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
  projectCategories?: {
    nodes: Array<{ slug: string }>;
  };
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
  ) {
    createReview(
      input: {
        title: $title
        content: $content
        excerpt: $excerpt
        status: $status
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
  ) {
    updateReview(
      input: {
        id: $id
        title: $title
        content: $content
        excerpt: $excerpt
        status: $status
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
    $supportCategories: SupportPostSupportCategoriesInput
  ) {
    createSupportPost(
      input: {
        title: $title
        content: $content
        status: $status
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
    $supportCategories: SupportPostSupportCategoriesInput
  ) {
    updateSupportPost(
      input: {
        id: $id
        title: $title
        content: $content
        status: $status
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
  supportCategories?: {
    nodes: Array<{ slug: string }>;
  };
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
// Media Mutations
// ==========================================

export const DELETE_MEDIA_ITEM = gql`
  mutation DeleteMediaItem($id: ID!) {
    deleteMediaItem(input: { id: $id, forceDelete: true }) {
      deletedId
    }
  }
`;

export interface DeleteMediaItemVariables {
  id: string;
}

export interface DeleteMediaItemData {
  deleteMediaItem: {
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
