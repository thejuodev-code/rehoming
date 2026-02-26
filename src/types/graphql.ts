export interface WordPressPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
        };
    };
}

export interface GetPostsData {
    posts: {
        nodes: WordPressPost[];
    };
}

export interface WordPressPage {
    id: string;
    title: string;
    slug: string;
    content: string;
}

export interface GetPagesData {
    pages: {
        nodes: WordPressPage[];
    };
}


export interface ActivityFields {
    type?: string;
    impactSummary?: string;
    pintoimpact?: boolean;
}

export interface ActivityPost {
    databaseId: number;
    title: string;
    excerpt: string;
    content?: string;
    date: string;
    slug: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
        };
    };
    projectCategories?: {
        nodes: {
            name: string;
            slug: string;
        }[];
    };
    activityFields?: ActivityFields;
}

export interface GetActivitiesData {
    projects: {
        nodes: ActivityPost[];
    };
}

export interface ActivityDetailPost {
    databaseId: number;
    title: string;
    content: string;
    excerpt: string;
    date: string;
    slug: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
        };
    };
    projectCategories?: {
        nodes: {
            name: string;
            slug: string;
        }[];
    };
    activityFields?: ActivityFields;
}

export interface GetActivityDetailData {
    projects: {
        nodes: ActivityDetailPost[];
    };
}

// ==========================================
// Animal (Adoption) Types
// ==========================================
export interface AnimalFields {
    age?: string;
    gender?: string;
    breed?: string;
    hashtags?: string;
    weight?: string;
    rescueDate?: string;
    rescueLocation?: string;
    personality?: string;
    medicalHistory?: string;
    image?: {
        node: {
            sourceUrl: string;
        };
    };
}

export interface GetAnimalBySlugData {
    animal: AnimalPost | null;
}

export interface AnimalPost {
    databaseId: number;
    title: string;
    excerpt: string; // Used for "2살 추정 | 여아 | 믹스" string
    content?: string;
    slug: string;
    date: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
        };
    };
    animalFields?: AnimalFields;
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
}

export interface GetAnimalsData {
    animals: {
        nodes: AnimalPost[];
    };
}

// ==========================================
// Review (입양 후기) Types
// ==========================================
export interface ReviewFields {
    authorName?: string;
    animalName?: string;
    adoptionDate?: string;
    rating?: number;
}

export interface ReviewPost {
    databaseId: number;
    title: string;
    excerpt: string;
    content?: string;
    slug: string;
    date: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
        };
    };
    reviewFields?: ReviewFields;
}

export interface GetReviewsData {
    reviews: {
        nodes: ReviewPost[];
    };
}
