

export interface ProjectCategory {
    name: string;
    slug: string;
}

export interface ActivityFields {
    type?: string;
    impactSummary?: string;
    pintoimpact?: boolean;
}

export interface ProjectNode {
    databaseId: number;
    title: string;
    content?: string;
    excerpt?: string;
    date?: string;
    slug?: string;
    projectCategories?: {
        nodes: ProjectCategory[];
    };
    activityFields?: ActivityFields;
    campaignFields?: {
        type?: string;
        impactsummary?: string;
        pintoimpact?: boolean;
    };
    featuredImage?: {
        node: {
            sourceUrl: string;
        };
    };
}

export interface GetProjectsData {
    projects: {
        nodes: ProjectNode[];
    };
}

export interface GraphQLResponse<T> {
    data?: T;
    errors?: Array<{
        message: string;
        locations?: Array<{ line: number; column: number }>;
        path?: string[];
    }>;
}


export interface Project {
    id: number;
    title: string;
    categoryName: string;
    categorySlug: string;
    image: string;
    impactSummary: string;
}


export interface ProjectCategoryConfig {
    slug: string;
    label: string;
    icon: string;
}
