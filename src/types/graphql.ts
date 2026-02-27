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
// Review (입양 후기) Types — 관리자 직접 등록 방식
// ==========================================
export interface ReviewFields {
    authorName?: string;    // 입양인 이름 (관리자 입력)
    animalName?: string;    // 동물 이름
    animalType?: string;    // "강아지" | "고양이" | "기타"
    adoptionDate?: string;  // 입양 완료일
    quote?: string;         // 카드 상단 핵심 한 줄 인용문
    isPinned?: boolean;     // true = 상단 고정 (featured 스타일 표시)
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

export interface GetReviewBySlugData {
    reviews: {
        nodes: ReviewPost[];
    };
}
