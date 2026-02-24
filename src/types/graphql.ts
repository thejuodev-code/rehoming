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
